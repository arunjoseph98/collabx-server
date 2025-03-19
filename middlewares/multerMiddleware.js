const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads"); 
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = `image-${Date.now()}${path.extname(file.originalname)}`;
    callback(null, uniqueSuffix);
  },
});

// File filter (Only allow images)
const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed."), false);
  }
};


const multerMiddleware = multer({
  storage,
  fileFilter,
});

module.exports = multerMiddleware;
