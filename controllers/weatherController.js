const axios = require('axios');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

// Function to fetch weather data for a specific city
exports.getWeather = async (req, res, next) => {
    const { location } = req.query;
    try {
        // Make a request to the weather API
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}`);

        res.json(response.data);
    } catch (error) {
        // Handle errors
        return next(createError(500, "Something went wrong"));
    }
};
