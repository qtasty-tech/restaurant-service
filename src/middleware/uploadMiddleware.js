const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { dirname } = require("path");

// Ensure uploads directory exists
const uploadDir = "uploads/";
fs.mkdir(uploadDir, { recursive: true }).catch((err) => {
  console.error("Failed to create uploads directory:", err);
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Images only (jpeg, jpg, png)!"));
    }
  },
});

module.exports = upload;