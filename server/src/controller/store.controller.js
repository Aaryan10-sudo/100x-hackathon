const Store = require("../model/store.model");
const Lead = require("../model/lead.model");
const User = require("../model/user.model");
const { sendEmail } = require("../config/nodemailer");
const redisClient = require("../config/redis");
const {
  validateCreateStore,
  validateUpdateStore,
} = require("../validation/store.validation");

const CACHE_TTL = 60 * 5;

async function redisGet(key) {
  try {
    if (!redisClient || typeof redisClient.get !== "function") return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn("redisGet failed", err?.message || err);
    return null;
  }
}

async function redisSet(key, value, ttl = CACHE_TTL) {
  try {
    if (!redisClient || typeof redisClient.set !== "function") return;
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    console.warn("redisSet failed", err?.message || err);
  }
}

async function redisDelPattern(pattern) {
  try {
    if (!redisClient || typeof redisClient.keys !== "function") return;
    const keys = await redisClient.keys(pattern);
    if (keys && keys.length) await redisClient.del(...keys);
  } catch (err) {
    console.warn("redisDelPattern failed", err?.message || err);
  }
}

// GET /api/v1/stores
exports.listStores = async (req, res) => {
  try {
    const q = req.query || {};
    const cacheKey = `stores:cat=${q.category || ""}:tags=${(
      q.tags || ""
    ).toString()}:near=${q.near || ""}:q=${q.q || ""}`;
    const cached = await redisGet(cacheKey);
    if (cached) return res.json({ stores: cached, cached: true });

    const filter = {};
    if (q.category) filter.category = q.category;
    if (q.tags)
      filter.tags = { $in: Array.isArray(q.tags) ? q.tags : q.tags.split(",") };
    // basic text search
    if (q.q) filter.$text = { $search: q.q };

    let stores = [];
    if (q.near) {
      // near should be lng,lat
      const [lng, lat] = q.near.split(",").map(Number);
      const radius = (parseFloat(q.radiusKm) || 10) * 1000;
      stores = await Store.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "dist.calculated",
            spherical: true,
            maxDistance: radius,
          },
        },
        { $match: filter },
        { $limit: 200 },
      ]);
    } else {
      stores = await Store.find(filter).limit(200).lean();
    }

    await redisSet(cacheKey, stores);
    return res.json({ stores });
  } catch (err) {
    console.error("listStores error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/v1/stores/:id
exports.getStore = async (req, res) => {
  try {
    const cacheKey = `store:${req.params.id}`;
    const cached = await redisGet(cacheKey);
    if (cached) return res.json({ store: cached, cached: true });

    const store = await Store.findById(req.params.id).lean();
    if (!store) return res.status(404).json({ message: "Store not found" });
    // increment views asynchronously
    try {
      if (redisClient && typeof redisClient.set === "function") {
        /* do lightweight tracking in redis */ await redisClient.incr(
          `store:${req.params.id}:views`
        );
      }
    } catch (e) {}

    await redisSet(cacheKey, store);
    return res.json({ store });
  } catch (err) {
    console.error("getStore error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/v1/stores  (create store) - authenticated
exports.createStore = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id)
      return res.status(401).json({ message: "Unauthorized" });

    // validate payload
    const { error } = validateCreateStore(req.body);
    if (error)
      return res
        .status(400)
        .json({ message: error.details.map((d) => d.message).join(", ") });

    const storeData = Object.assign({}, req.body, { owner: user.id });
    const store = await Store.create(storeData);

    // update user role to business (use existing enum value 'buisness')
    try {
      await User.findByIdAndUpdate(user.id, { role: "buisness" });
    } catch (e) {
      console.warn("failed to update user role", e?.message || e);
    }

    // invalidate store listing cache
    try {
      await redisDelPattern("stores:*");
    } catch (e) {}

    return res.status(201).json({ message: "Store created", store });
  } catch (err) {
    console.error("createStore error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/v1/stores/:id - owner-only update
exports.updateStore = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    if (String(store.owner) !== String(user.id))
      return res.status(403).json({ message: "Forbidden: not the owner" });

    const { error } = validateUpdateStore(req.body);
    if (error)
      return res
        .status(400)
        .json({ message: error.details.map((d) => d.message).join(", ") });

    Object.assign(store, req.body);
    await store.save();

    // invalidate caches
    try {
      await redisDelPattern("stores:*");
      await redisDelPattern(`store:${store._id}`);
    } catch (e) {}

    return res.json({ message: "Store updated", store });
  } catch (err) {
    console.error("updateStore error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/v1/stores/:id/leads - owner-only view leads
exports.listLeadsForStore = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    if (String(store.owner) !== String(user.id))
      return res.status(403).json({ message: "Forbidden: not the owner" });

    const leads = await Lead.find({ store: store._id })
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    return res.json({ leads });
  } catch (err) {
    console.error("listLeadsForStore error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/v1/stores/:id/contact
exports.contactStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    const { name, email, phone, message, source } = req.body;
    if (!email)
      return res.status(400).json({ message: "client email required" });

    const store = await Store.findById(storeId).lean();
    if (!store) return res.status(404).json({ message: "Store not found" });

    // create lead
    const lead = await Lead.create({
      store: store._id,
      storeSnapshot: {
        name: store.name,
        email: store.email,
        phone: store.phone,
      },
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      message,
      source,
    });

    // atomically increment store leads counter
    try {
      await Store.updateOne(
        { _id: store._id },
        { $inc: { "analytics.leads": 1 } }
      );
    } catch (e) {
      console.warn("failed increment analytics", e);
    }

    // prepare mail to store owner
    const mail = {
      from: process.env.SMTP_USER,
      to: store.email,
      subject: `New lead for ${store.name}`,
      html: `<p>New lead from ${
        name || "Guest"
      }</p><p>Email: ${email}</p><p>Phone: ${phone || "N/A"}</p><p>Message: ${
        message || ""
      }</p><p>Lead id: ${lead._id}</p>`,
    };

    // try to send immediately
    try {
      const result = await sendEmail(mail);
      if (result && result.preview)
        console.log("Ethereal preview URL:", result.preview);
      return res
        .status(201)
        .json({ message: "Lead created and emailed", leadId: lead._id });
    } catch (err) {
      console.warn(
        "Immediate lead email failed, queueing:",
        err?.message || err
      );
      // push to redis queue
      try {
        if (redisClient && typeof redisClient.rPush === "function") {
          await redisClient.rPush(
            "email_queue",
            JSON.stringify({ type: "lead", mail, leadId: lead._id })
          );
        }
      } catch (qe) {
        console.error("Failed to enqueue lead email", qe?.message || qe);
      }
      return res
        .status(201)
        .json({ message: "Lead created (email queued)", leadId: lead._id });
    }
  } catch (err) {
    console.error("contactStore error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = exports;
