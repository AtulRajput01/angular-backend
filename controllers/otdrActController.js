const OtdrAct = require('../models/otdrActModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

// create Outdoor Activity
const createOtdrAct = async (req, res, next) => {
    try {
        const newAct = new OtdrAct({
            actName: req.body.actName,
            actPlace: req.body.actPlace,
            actDate: req.body.actDate,
            actTime: req.body.actTime,
            actPrice: req.body.actPrice,
            profilePicture: req.body.profilePicture,
            actTaC: req.body.actTaC,
            actDesc: req.body.actDesc,
            type: "outdoor"
        });
        await newAct.save();
        return res.status(200).json({ success: true, message: "Outdoor Activity Registered Successfully" });
    } catch (error) {
        return next(createError(500, "Something went wrong"));
    }
};

// Get Outdoor Activity by ID
const getOtdrAct = async (req, res, next) => {
    try {
        const inAct = await OtdrAct.findById(req.params.id);
        if (!inAct) {
            return next(createError(404, "Outdoor Activty Not Found"));
        }
        return next(createSuccess(200, "Single Outdoor Activity", inAct));
    } catch (error) {
        return next(createError(500, "Internal Server Error"))
    }
};

//get All Outdoor Activity
const getAllOtdrActs = async (req, res, next) => {
    try {
        const inActs = await OtdrAct.find();
        return next(createSuccess(200, "All Outdoor Activity", inActs));

    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
};

// delete Indoor Activities
const deleteOtdrAct = async (req, res, next) => {
    try {
        const inAct = await OtdrAct.findByIdAndDelete(req.params.id);
        if (inAct) {
            return next(createSuccess(200, "Outdoor Activity Deleted!"));
        } else {
            return next(createError(404, "Outdoor Activity Not Found."));
        }
    } catch (error) {
        return next(createError(500, "Internal Server Error: Something went wrong."));
    }
};

module.exports = { createOtdrAct, getOtdrAct, getAllOtdrActs, deleteOtdrAct };