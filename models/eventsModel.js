const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const events = new Schema(
    {
        eventName: {
            type: String,
            required: true
        },
        eventPlace: {
            type: String,
            required: false
        },
        eventLunch: {
            type: String,
            required: false
        }, 
        eventPrice: {
            type: Number,
            required: false
        },
        profilePicture: {
            type: String,
            required: false
        },
        eventTermCon: {
            type: String,
            required: false
        },
        eventDes: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false,
            default: "event"  
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('event', events);