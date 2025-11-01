const express = require("express");
const {
  googleLogin,
  logout,
  getMe,
} = require("../controller/google.controller");
const { register, login } = require("../controller/auth.controller");
const auth = require("../middleware/auth");
const router = express.Router();

// Google sign-in (accepts id_token from client)
router.post("/google", googleLogin);

// Register with email/password
router.post("/register", register);

// Login with email/password
router.post("/login", login);
// Set or change password (requires auth cookie or token)
const { setPassword } = require("../controller/auth.controller");
router.post("/set-password", auth, setPassword);

// Logout (clears cookie)
router.get("/logout", logout);

// Get current authenticated user (uses cookie or Authorization header)
router.get("/me", auth, getMe); // my profile type ko

module.exports = router;
