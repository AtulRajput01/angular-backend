const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const managePlace = new Schema(
    {
        placeName: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        profilePicture: {
            type: String,
            required: false
        },
        termCon: {
            type: String,
            required: true
        },
        des: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false,
            default: "place"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('mngPlace', managePlace);