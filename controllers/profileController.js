const Profile = require('../models/profile');

exports.createProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const profileImage = req.file ? "http://localhost:3000/uploads/profiles/"+req.file.filename : null;
    const profile = new Profile({ name, profileImage });
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};