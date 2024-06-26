const Cart = require('../models/cartModel');
const inDrAct = require('../models/inDrActModel');
const otdoorAct = require('../models/otdrActModel');
const mngPlace = require('../models/mngPlaceModel');
const events = require('../models/eventsModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const mongoose = require('mongoose');


// Controller function to add an activity to the cart
exports.IndoorAddToCart = async (req, res, next) => {
  const { activityId } = req.body;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(activityId);
    if (!isValidObjectId) {
      // return res.status(400).json({ message: 'Invalid activityId' });
      return next(createError(400, "Invalid Indoor ActivityId"));
    }

    const activity = await inDrAct.findById(activityId);
    if (!activity) {
      // return res.status(404).json({ message: 'Activity not found' });
      return next(createError(404, "Indoor Activity not found"));
    }

    let cart = await Cart.findOne({});
    if (!cart) {
      cart = new Cart({
        // user: req.user._id,
        activities: [activity]
      });
    } else {
      cart.activities.push(activity);
    }

    await cart.save();
    // res.status(201).json({ message: 'Activity added to cart successfully' });
    return next(createSuccess(201, "Indoor Activity Added to Cart Successfully"));
  } catch (err) {
    // res.status(500).json({ message: err.message });
    return next(createError(500, "Internal Server Error"))
  }
};

//outdor Activity 
exports.outdoorAddToCart = async (req, res, next) => {
  const { activityId } = req.body;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(activityId);
    if (!isValidObjectId) {
      // return res.status(400).json({ message: 'Invalid activityId' });
      return next(createError(400, "Invalid Outdoor ActivityId"));
    }

    const activity = await otdoorAct.findById(activityId);
    if (!activity) {
      // return res.status(404).json({ message: 'Activity not found' });
      return next(createError(404, "Outdoor Activity Not Found"));
    }

    let cart = await Cart.findOne({});
    if (!cart) {
      cart = new Cart({
        // user: req.user._id,
        activities: [activity]
      });
    } else {
      cart.activities.push(activity);
    }

    await cart.save();
    // res.status(201).json({ message: 'Activity added to cart successfully' });
    return next(createSuccess(201, "Outdoor Activity Added to Cart Successfully"));
  } catch (err) {
    // res.status(500).json({ message: err.message });
    return next(createError(500, "Internal Server Error"))
  }
};

//manage place
exports.placeAddToCart = async (req, res, next) => {
  const { placeId } = req.body;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(placeId);
    if (!isValidObjectId) {
      // return res.status(400).json({ message: 'Invalid activityId' });
      return next(createError(400, "Invalid PlaceId"));
    }

    const place = await mngPlace.findById(placeId);
    if (!place) {
      // return res.status(404).json({ message: 'Activity not found' });
      return next(createError(404, "Place Not Found"));
    }

    let cart = await Cart.findOne({});
    if (!cart) {
      cart = new Cart({
        // user: req.user._id,
        places: [place]
      });

    } else {
      cart.places.push(place);
    }

    await cart.save();
    // res.status(201).json({ message: 'Activity added to cart successfully' });
    return next(createSuccess(201, "Place Added to Cart Successfully"));
  } catch (err) {
    // res.status(500).json({ message: err.message });
    return next(createError(500, "Internal Server Error"))
  }
};


//upcoming events
exports.eventsAddToCart = async (req, res, next) => {
  const { eventId } = req.body;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(eventId);
    if (!isValidObjectId) {
      // return res.status(400).json({ message: 'Invalid activityId' });
      return next(createError(400, "Invalid EventId"));
    }

    const event = await events.findById(eventId);
    if (!event) {
      // return res.status(404).json({ message: 'Activity not found' });
      return next(createError(404, "Event Not Found"));
    }

    let cart = await Cart.findOne({});
    if (!cart) {
      cart = new Cart({
        // user: req.user._id,
        events: [event]
      });

    } else {
      cart.events.push(event);
    }

    await cart.save();
    // res.status(201).json({ message: 'Activity added to cart successfully' });
    return next(createSuccess(201, "Event Added to Cart Successfully"));
  } catch (err) {
    // res.status(500).json({ message: err.message });
    return next(createError(500, "Internal Server Error"))
  }
};


// get all cart items
exports.getAllCart = async (req, res, next) => {
  try {
    const carts = await Cart.find({});
    // return res.status(200).send(carts);
    return next(createSuccess(200, "All Cart Items", carts));


  } catch (error) {
    // return res.status(500).send("Internal Server Error!")
    return next(createError(500, "Internal Server Error"))
  }
};


// Delete cart item by ID
exports.deleteCartById = async (req, res, next) => {
  const { cartId } = req.params;

  try {
    // Find and delete the cart item by ID
    const deletedCart = await Cart.findByIdAndDelete(cartId);

    if (!deletedCart) {
      // If the cart item was not found, return a 404 error
      return next(createError(404, "Cart item not found"));
    }

    // Return a success response
    return next(createSuccess(200, "Cart item deleted successfully", deletedCart));
  } catch (err) {
    // If an error occurs, return a 500 error
    return next(createError(500, "Internal Server Error"));
  }
};


