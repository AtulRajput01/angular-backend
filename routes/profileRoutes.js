const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles'); // Destination folder for profile images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  }
});

const upload = multer({ storage: storage });

// Profile routes
router.post('/', upload.single('profileImage'), profileController.createProfile);
router.get('/', profileController.getAllProfiles);

module.exports = router;