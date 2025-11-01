const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
  try {
    let token = null;

    // 1) Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) Cookie (requires cookie-parser middleware in app)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token)
      return res.status(401).json({ message: "Unauthorized: no token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err)
        return res.status(403).json({ message: "Forbidden: invalid token" });
      req.user = payload; // payload contains { id }
      next();
    });
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = auth;
