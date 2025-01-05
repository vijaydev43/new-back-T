const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
        userId: { type: Schema.Types.ObjectId, default: null },
        houseNo: { type: String, trim: true, default: null },
        district: { type: String, trim: true, default: null },
        fullAddress: { type: String, trim: true, default: null },
        street: { type: String, trim: true, default: null },
        city: { type: String, trim: true, default: null },
        state: { type: String, trim: true, default: null },
        country: { type: String, trim: true, default: null },
        postalCode: { type: String, trim: true, default: null },
        landMark: { type: String, trim: true, default: null },
        contactPerson: { type: String, trim: true, default: null },
        contactPersonNumber: { type: String, trim: true, default: null },
        addressType: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
        region: { type: String, default: null },
        type: { type: String, enum: ["primary", "secondary"], default: "secondary" },
        deleted:{type:Boolean,default:false}
}, { timestamps: true })


module.exports = mongoose.model("address", addressSchema);