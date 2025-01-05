const mongoose = require("mongoose")
const productCateModel = require("../productCateModel")
const { Schema } = mongoose

const categorySchema = new Schema({
    productCateId:{type: Schema.Types.ObjectId,default: null},
    cateName:{type:String,default:null},
    cateDesc:{type:String,default:null},
    cateImg:{type:String,default:null},
    cateStatus:{type:Boolean,default:false},
    deleted:{type:Boolean,default:false}
},{timestamps:true})

const categoryModel = mongoose.model ("category",categorySchema)

module.exports = categoryModel