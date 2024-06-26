const Activity = require('../models/activityModel');
const Cart1 = require('../models/cartTESTModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');



// add item
exports.addToCart = async (req, res, next) => {
  const { activityId } = req.body;
  const accessToken = req.body.token;
  const decodedToken = jwt.decode(accessToken);
  const userId = decodedToken ? decodedToken.id : null;
  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const existingCartItem = await Cart1.findOne({ activityId: activity._id, userId: userId });
    if (existingCartItem) {
      return res.status(400).json({ message: "Activity is already in the cart" });
    }

    const cartItem = new Cart1({
      activityId: activity._id,
      userId: userId,
      name: activity.name,
      place: activity.place,
      price: activity.price,
      images: activity.images,
      termComdtion: activity.termComdtion,
      description: activity.description,
      type: activity.type,
      isSchedule: false
    });

    await cartItem.save();
    return next(createSuccess(200,"Activity Added to Cart Successfully"));
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

// get All 
exports.getAllCart = async (req, res, next) => {
  const {userId}=req.params;
  try {
    const cart = await Cart1.find({ isSchedule: false , userId:userId });
    return res.status(200).json({
      message: "All Cart Items",
      data: cart
    });
  } catch (err) {
    console.error(err);
    return next(createError(500, "Internal Server Error!"));
  }
};

// get by id
exports.getOneById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cart = await Cart1.findOne({ activityId: id });
    if (!cart) {
      return next(createError(404, "Cart Not Found"));
    }
    return res.status(200).json({
      message: "Activity Found",
      data: cart
    });
  } catch (err) {
    console.error(err);
    return next(createError(500, "Internal Server Error!"));
  }
};

// delete by id
exports.deleteCartById = async (req, res, next) => {
  const { id } = req.params;
  const accessToken = req.body.token;
  const decodedToken = jwt.decode(accessToken);
  const userId = decodedToken ? decodedToken.id : null;
  try {
    const cart = await Cart1.findOne({ userId });

    if (!cart) {
      return next(createError(404, "Cart Not Found"));
    }

    const index = cart.activities.findIndex(activity => activity._id.toString() === id);
    if (index === -1) {
      return next(createError(404, "Activity Not Found in Cart"));
    }
    cart.activities.splice(index, 1);
    await cart.save();

    return next(createSuccess(200, "Cart Item Deleted Successfully"));
  } catch (err) {
    console.error(err);
    return next(createError(500, "Internal Server Error!"));
  }
};


