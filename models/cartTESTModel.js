const mongoose = require('mongoose');

const cartSchema1 = new mongoose.Schema({
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    place: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    termComdtion: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    isSchedule: { type: Boolean, default: false }
});

const Cart1 = mongoose.model('Cart1', cartSchema1);

module.exports = Cart1;
