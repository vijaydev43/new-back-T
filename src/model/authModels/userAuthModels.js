const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
   firstName:{type:String,require:true},
   lastName:{type:String,require:true},
   email:{type:String,require:true},
   imgUrl:{type:String,default:null},
   phoneNo:{type:String,default:null},
   password:{type:String,default:null},
   uuid:{type:String,default:null},
   status: { type: Boolean, default: false },
   fcmToken:{type:String,default:null},
   region:{type:String,default:null},
   secretKey: { type: String, default: null },
   lastSeen: { type: Date, default: null },
   noOfOrdersPerMonth: { type: Number, default: null },
   deleted: { type: Boolean, default: false },
   isBlocked:{type:Boolean,default:false},

   role:{type:String,enum:["user","deliveryman"],default:'user'}
}, { timestamps: true })


module.exports = mongoose.model("usersList", userSchema);