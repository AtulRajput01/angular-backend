const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const policySchema = new Schema(
    {
        heading1: {
            type: String,
            required: false
        },
        content1: {
            type: String,
            required: false
        },
        heading2: {
            type: String,
            required: false
        },
        content2: {
            type: String,
            required: false
        },
        heading3: {
            type: String,
            required: false
        },
        content3: {
            type: String,
            required: false
        },
        heading4: {
            type: String,
            required: false
        },
        content4: {
            type: String,
            required: false
        },
        heading5: {
            type: String,
            required: false
        },
        content5: {
            type: String,
            required: false
        }
    }
);

module.exports = mongoose.model('policy', policySchema);