const mongoose = require('mongoose')
const { Schema } = mongoose

const productCategoriesSchema = new Schema({
    productName: { type: String, default:null },
    productImgUrl: { type: String ,default:null},
    productTitle: { type: String,default:null },
    productDescription: { type: String },
    productType: { type: String,enum: ["tiftoProducts", 'grossary'], default: 'tiftoProducts'},
    status: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    categoryCode: { type: Number}
},{timestamps: true})

module.exports = mongoose.model('productCategories',productCategoriesSchema)