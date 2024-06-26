const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        name: { type: String, required: true },
        age: { type: String, required: true },
        relationship: { type: String, required: true }
    }]
});


const memberDetails = mongoose.model('MemberDetails', memberSchema);
module.exports = memberDetails;