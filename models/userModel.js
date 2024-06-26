const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// For image
const imageSchema1 = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true }
  });

const UserSchema = mongoose.Schema(
    {
        name: { type: String, required: true },  
        mobile: { type: String, required: false },    
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },   
        place: { type: String, required: false },       
        zipCode: { type: String, required: false },
        images: [imageSchema1], 
        otp: { type: String },
        otpExpiration: { type: Date },        
        roles: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "Role"
        },
        deviceToken:{type:String,required:false}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', UserSchema);