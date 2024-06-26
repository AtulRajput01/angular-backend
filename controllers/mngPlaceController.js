const mngPlace = require('../models/mngPlaceModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

// create place
const createPlace = async (req, res, next) => {
    try {

        const newPlace = new mngPlace({
            placeName: req.body.placeName,
            date: req.body.date,
            price: req.body.price,
            profilePicture: req.body.profilePicture,
            termCon: req.body.termCon,
            des: req.body.des,
            type: "place"
        });
        await newPlace.save();
        // return res.status(200).json({ success: true, message: "Place Registered Successfully" });
        return next(createSuccess(200, "Place Registered Successfully"));
    } catch (error) {
        return next(createError(500, "Something went wrong"));
    }
};

// get place by ID
const getPlace = async (req, res, next) => {
    try {
        const place = await mngPlace.findById(req.params.id);
        if (!place) {
            return next(createError(404, "Place Not Found"));
        }
        return next(createSuccess(200, "Single Place", place));
    } catch (error) {
        return next(createError(500, "Internal Server Error"))
    }
};

// get all places
const getPlaces = async (req, res, next) => {
    try {
        const places = await mngPlace.find();
        return next(createSuccess(200, "All Places", places));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

// update place by ID
const updatePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await mngPlace.findByIdAndUpdate(id, req.body);
        if (!place) {
            return next(createError(404, "Place Not Found"));
        }
        return next(createSuccess(200, "Place Details Updated", place));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};


// delete place by ID
const deletePlace = async (req, res, next) => {
    try {
        const place = await mngPlace.findByIdAndDelete(req.params.id);
        if (place) {
            return next(createSuccess(200, "Place Deleted!"));
        } else {
            return next(createError(404, "Place Not Found."));
        }
    } catch (error) {
        return next(createError(500, "Internal Server Error: Something went wrong."));
    }
};

module.exports = { createPlace, getPlace, getPlaces, updatePlace, deletePlace };