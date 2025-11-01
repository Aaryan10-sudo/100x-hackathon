const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
    index: true,
  },
  storeSnapshot: { name: String, email: String, phone: String },
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  message: String,
  source: String,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["new", "contacted", "closed"],
    default: "new",
  },
  metadata: Object,
});

module.exports = mongoose.model("Lead", leadSchema);
