// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // hide password in queries by default
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String, // store Cloudinary or Google profile picture URL
      default:
        "https://res.cloudinary.com/dvmcocgdu/image/upload/v1730400000/default-avatar.png",
    },
    role: {
      type: String,
      enum: ["user", "buisness"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔒 Hash password only if it's new or modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
