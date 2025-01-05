const mongoose = require("mongoose")
const {Schema} = mongoose

const cartSchema = new Schema({
    productId : { type : Schema.Types.ObjectId,default: null},
    isCustomized: { type: Boolean,default: false},
    selectedVariantId:{type : Schema.Types.ObjectId, default: null},
    quantity: { type: Number ,default: 1},
    userId: { type: Schema.Types.ObjectId},
    deleted: { type: Boolean,default: false},
},{timestamps:true}) 

module.exports = mongoose.model("cart",cartSchema)
