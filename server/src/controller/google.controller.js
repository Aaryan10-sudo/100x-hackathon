// controllers/authController.js
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const dotenv = require("dotenv");
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify ID token from client, then create or update a user record.
// Expects { token } in req.body where token is Google's ID token (id_token).
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Missing token" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture, sub: googleId } = payload || {};

    if (!email)
      return res.status(400).json({ message: "Google token missing email" });

    // Try to find existing user by googleId first, then fallback to email
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
    }

    if (user) {
      // If user exists but doesn't have googleId saved, link it and update info
      const needsUpdate =
        !user.googleId || user.name !== name || user.avatar !== picture;
      if (needsUpdate) {
        user.googleId = googleId;
        user.name = name || user.name;
        user.avatar = picture || user.avatar;
        await user.save();
      }
    } else {
      // Create new user (no password). Password field is optional in schema.
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
      });
    }

    // Create JWT for application auth
    const tokenPayload = { id: user._id };
    const jwtToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user (without password) and token
    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user,
    });
  } catch (error) {
    console.error("googleLogin error:", error?.message || error);
    res
      .status(400)
      .json({ message: "Google authentication failed", error: error?.message });
  }
};
