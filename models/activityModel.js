const { Timestamp } = require('firebase-admin/firestore');
const mongoose = require('mongoose');

const imageSchema1 = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true }
});

const activitySchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    place: { type: String, required: false },
    price: { type: String, required: false },
    images: [imageSchema1],
    termComdtion: { type: String, required: false },
    description: { type: String, required: false },
    type: { type: String, enum: ['indoor', 'outdoor', 'place', 'event'], required: true }
  },
  {
    timestamps: true
  }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
