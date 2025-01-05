const mongoose = require('mongoose')
const { Schema } = mongoose

const otpSchema = new Schema({
    otpId : { type: String },
    otp : { type: String },
    OTP : { type: Number},
    expirationTime : { type: Date}
},{timestamps: true})

module.exports = mongoose.model('otps',otpSchema)