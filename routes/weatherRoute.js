const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Route to fetch weather data for a specific city
router.get('/location', weatherController.getWeather);

module.exports = router;
