const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
   userName:{type:String,require:true},
   email:{type:String,require:true},
   password:{type:String,require:true},
   imgUrl:{type:String,default:null},
   phoneNo:{type:String,default:null},
   // subId:{type:String,default:null},
   isVerified: { type: Boolean, default: false },
   secretKey: { type: String, default: null },
   fcmToken:{type:String,default:null},
   isBlocked:{type:Boolean,default:false},
   deleted:{type:Boolean,default:false},
   role:{type:String,enum:["admin","subAdmin"],default:"subAdmin"},
   deleted: { type: Boolean, default: false },
   subAdminType:[{type:String,default:null}]
}, { timestamps: true })


module.exports = mongoose.model("adminList", adminSchema);