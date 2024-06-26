const event = require('../models/eventsModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

// create events
const createEvent = async (req, res, next) => {
    try {

        const newEvent = new event({
            eventName: req.body.eventName,
            eventPlace: req.body.eventPlace,
            eventLunch: req.body.eventLunch,
            eventPrice: req.body.eventPrice,
            profilePicture: req.body.profilePicture,
            eventTermCon: req.body.eventTermCon,
            eventDes: req.body.eventDes,
            type: "event"
        });
        await newEvent.save();
        return res.status(200).json({ success: true, message: "Event Registered Successfully" });
    } catch (error) {
        return next(createError(500, "Something went wrong"));
    }
};

// get events by ID
const getEvent = async (req, res, next) => {
    try {
        const events = await event.findById(req.params.id);
        if (!events) {
            return next(createError(404, "Events Not Found"));
        }
        return next(createSuccess(200, "Single Events", events));
    } catch (error) {
        return next(createError(500, "Internal Server Error"))
    }
};

// get all events
const getEvents = async (req, res, next) => {
    try {
        const events = await event.find();
        return next(createSuccess(200, "All Events", events));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

// delete event by ID
const deleteEvent = async (req, res, next) => {
    try {
        const events = await event.findByIdAndDelete(req.params.id);
        if (events) {
            return next(createSuccess(200, "Event Deleted!"));
        } else {
            return next(createError(404, "Event Not Found."));
        }
    } catch (error) {
        return next(createError(500, "Internal Server Error: Something went wrong."));
    }
};

module.exports = { createEvent, getEvent, getEvents, deleteEvent };