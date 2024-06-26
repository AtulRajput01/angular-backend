const Cart1 = require('../models/cartTESTModel');
const schedule = require('../models/scheduleCartModel');
const User = require('../models/userModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const { notification } = require('../controllers/notificationController')
const jwt = require('jsonwebtoken');
const blobStream = require('blob-stream');
const { PDFDocument, rgb } = require('pdf-lib');


// add item
exports.schedule = async (req, res, next) => {
  const id = req.body.activityId;
  const scheduleTime = req.body.scheduleTime;
  const scheduleDate = req.body.scheduleDate;
  const accessToken = req.body.token;
  const decodedToken = jwt.decode(accessToken);
  const userId = decodedToken ? decodedToken.id : null;
  try {
    const cartValue = await Cart1.findOne({ activityId: id, userId: userId });
    if (!cartValue) {
      return res.status(404).json({ message: "schedule not found" });
    }
    const scheduleDoc = new schedule({
      activityId: cartValue.activityId,
      userId: userId,
      name: cartValue.name,
      place: cartValue.place,
      price: cartValue.price,
      images: cartValue.images,
      termComdtion: cartValue.termComdtion,
      description: cartValue.description,
      type: cartValue.type,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime,
      isSchedule: false
    });
    await scheduleDoc.save();
    await Cart1.findOneAndUpdate({ activityId: id }, { isSchedule: true });
    if (req.body.notify) {
      const userData = await User.findOne({ _id: userId });
      const deviceToken = userData.deviceToken;
      await notification('Hello!', 'activites scheduled', cartValue.name, scheduleDate, scheduleTime, deviceToken);
    }
    return next(createSuccess(200, `scheduled date ${scheduleDate} time ${scheduleTime}`));
  } catch (error) {
    console.error(error);
    return next(createError(500, "Something went wrong"));
  }
};


exports.GetAllSchedule = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const now = new Date();
    const scheduleDate = now.toISOString().split('T')[0];
    const scheduled = await schedule.find({ scheduleDate: { $gte: scheduleDate }, userId: userId });
    return res.status(200).json({
      message: "All Scheduled Items",
      data: scheduled
    });
  } catch (err) {
    console.error(err);
    return next(createError(500, "Internal Server Error!"));
  }
};

exports.deleteSchedule = async (req, res, next) => {
  const { id } = req.params;
  const accessToken = req.body.token;
  const decodedToken = jwt.decode(accessToken);
  const userId = decodedToken ? decodedToken.id : null;
  try {
    const scheduleValue = await schedule.findOne({ userId: userId, activityId: id });

    if (!scheduleValue) {
      return next(createError(404, "Cart Not Found"));
    }

    const index = schedule.activities.findIndex(activity => activity._id.toString() === id);
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

exports.GetAllHistory = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const now = new Date();
    const scheduleDate = now.toISOString().split('T')[0];
    const scheduled = await schedule.find({ isSchedule: true, userId: userId, scheduleDate: { $lt: scheduleDate } });
    return res.status(200).json({
      message: "All Scheduled Items",
      data: scheduled
    });
  } catch (err) {
    console.error(err);
    return next(createError(500, "Internal Server Error!"));
  }
};

exports.getOneById = async (req, res, next) => {

  const { id } = req.params;
  try {
    const scheduled = await schedule.findOne({ activityId: id });
    if (!scheduled) {
      return next(createError(404, "schedule Not Found"));
    }
    return res.status(200).json({
      message: "schedule Found",
      data: cart
    });
  } catch (err) {
    console.error(err);
    return next(createError(500, "Internal Server Error!"));
  }
};

exports.downloadS = async (req, res) => {
  try {
    const jsonData =await schedule.findById(req.body.id);

    const pdfBytes = await generatePdfFromJson(jsonData);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=generated.pdf",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
};

async function generatePdfFromJson(jsonData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { name, place, price, images } = jsonData;
  page.drawText(`Activity Name: ${name}`, {
    x: 50,
    y: 750,
    size: 20,
    color: rgb(0, 0.53, 0.71),
  });

  page.drawText(`Place: ${place}`, {
    x: 50,
    y: 720,
    size: 15,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Price: ${price}`, {
    x: 50,
    y: 690,
    size: 15,
    color: rgb(0, 0, 0),
  });
 
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
