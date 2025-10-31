// utils/cloudinaryUpload.js
const streamifier = require("streamifier");
const { cloudinary_js_config } = require("../config/cloudinary");
function uploadBufferToCloudinary(buffer, folder = "tourism_app") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary_js_config.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = uploadBufferToCloudinary;
