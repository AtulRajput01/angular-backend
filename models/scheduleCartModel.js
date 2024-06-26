const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    place: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    termComdtion: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    scheduleDate: { type: String, required: false },
    scheduleTime: { type: String, required: false },
    isSchedule: { type: Boolean, default: false }
});

const scheduleCart = mongoose.model('ScheduleCart', scheduleSchema);

module.exports = scheduleCart;
