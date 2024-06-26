const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new mongoose.Schema({
  activities: [{ type: Object }],
  // places: [{ type: Object, ref: 'Place' }],
  // events: [{ type: Object, ref: 'Event'}]
});

module.exports = mongoose.model('Cart', cartSchema);
