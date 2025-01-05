const mongoose = require("mongoose");
const { Schema } = mongoose;

const bannerSchema = new Schema({
  name: { type: String,default: null },
  title:{ type: String,default: null },
  imageUrl: { type: String,default: null },
  status: { type: Boolean,  default: true},
  //display the users banner
  userType: { type: String, enum: ["consumer","deliveryman"],default:"consumer" },
  productType:{type: String, enum: ["tiftoProducts","groceryShop"], default: 'tiftoProducts'},
  bannerType:{type:String, enum:["category","home","middle"] ,default:"home"},
  deleted: { type: Boolean, default: false },
}, { timestamps: true })


module.exports = mongoose.model("banners", bannerSchema);