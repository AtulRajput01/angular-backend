const InActivity  = require('../models/inDrActModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')

//to create Indoor Activity
const createInAct = async (req, res, next) => {
  try {
    const newAct = new InActivity({
      actName: req.body.actName,
      actPlace: req.body.actPlace,
      actDate: req.body.actDate,
      actTime: req.body.actTime,
      actPrice: req.body.actPrice,  
      profilePicture: req.body.profilePicture,
      actTaC: req.body.actTaC,
      actDesc: req.body.actDesc,
      type: "indoor"
    });
    await newAct.save();
    return res.status(200).json({ success: true, message: "Indoor Activity Registered Successfully" });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

// Get Indoor Activity by ID
const getAct = async (req, res, next) => {
  try {
      const inAct = await InActivity.findById(req.params.id);
      if (!inAct) {
          return next(createError(404, "Indoor Activty Not Found"));
      }
      return next(createSuccess(200, "Single Indoor Activity",inAct));
  } catch (error) {
      return next(createError(500, "Internal Server Error"))
  }
}

//get All Indoor Activity
const getAllActs= async (req, res, next) => {
  try {
      const inActs = await InActivity.find();
      return next(createSuccess(200, "All Indoor Activity", inActs));

  } catch (error) {
      return next(createError(500, "Internal Server Error!"))
  }
}

// update Indoor Activity


// delete Indoor Activities
const deleteAct = async (req, res, next) => {
  try {
      const inAct = await InActivity.findByIdAndDelete(req.params.id);
      if (inAct) {
          return next(createSuccess(200, "Indoor Activity Deleted!"));
      } else {
          return next(createError(404, "Indoor Activity Not Found."));
      }
  } catch (error) {
      return next(createError(500, "Internal Server Error: Something went wrong."));
  }
};


module.exports = { createInAct, getAct, getAllActs, deleteAct };