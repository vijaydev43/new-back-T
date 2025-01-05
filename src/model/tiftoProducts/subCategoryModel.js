const mongoose = require("mongoose")
const { Schema } = mongoose

const subCateSchema = new Schema({
    productCateId:{type: Schema.Types.ObjectId,default: null},
    categoryId:{type: Schema.Types.ObjectId,default: null},
    subCateName:{type:String,default:null},
    subCateDesc:{type:String,default:null},
    subCateImg:{type:String,default:null},
    subCateStatus:{type:Boolean,default:true},
    deleted:{type:Boolean,default:false}
},{timestamps:true})
const subCateModel = mongoose.model("subCategories",subCateSchema)
module.exports = subCateModel