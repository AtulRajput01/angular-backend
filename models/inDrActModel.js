const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const InActivitySchema = new Schema(
    {
        actName: {
            type: String,
            required: true
        },
        actPlace: {
            type: String,
            required: true
        },
        actDate: {
            type: Date, // Changed type to Date assuming it represents date/time
            required: true
        },
        actTime: {
            type: String,
            required: true
        },
        actPrice: {
            type: Number,
            required: true
        },
        profilePicture: {
          type: String, // Assuming you will store the path to the profile picture
          required: false
        },
        actTaC: {
            type: String,
            required: true
        },
        actDesc: {
            type: String,
            required: true
        },
        type: {
          type: String,
          required: false,
          default: "indoor"  
        },
        roles: [{
            type: Schema.Types.ObjectId,
            ref: "Role"
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('InActivity', InActivitySchema);
