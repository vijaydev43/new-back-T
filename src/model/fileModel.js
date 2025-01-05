const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileSchema = new Schema({
  name: { type: String, default: null },
  file: { type: String, default: null },
  imgUrl: { type: String, default: null },
  mimeType: { type: String, default: null },
  deleted: { type: Boolean, default: false },
}, { timestamps: true })


module.exports = mongoose.model("files", fileSchema);