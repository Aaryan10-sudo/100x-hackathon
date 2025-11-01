// config/multer.js
const multer = require("multer");

// Use memory storage so we can stream buffer to Cloudinary lu herw hai guys
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // allow images only
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed!"), false);
  } else {
    cb(null, true);
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024 // 10 MB per file (adjust as needed)
};

const uploadSingle = multer({ storage, fileFilter, limits }).single("image");
const uploadMultiple = multer({ storage, fileFilter, limits }).array("images", 5); // up to 5 images yaha herw hai guys

module.exports = {
  uploadSingle,
  uploadMultiple
};
