const express = require("express")
const fileRoute = express.Router()
const fileController = require("../controller/fileController")
const multer = require('multer');

multer({ dest: "uploads/" });

const currentTime = new Date().getTime();
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, currentTime + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");
fileRoute.route("/fileUpload")
  .post(upload, async (req, res) => {
    console.log("check upload")
    let result = await fileController.createFile(req);
    res.status(result.code).send(result)
  })

fileRoute.route("/upload/:userId")
  .post(upload, async (req, res) => {
    let result = await fileController.createFile(req);
    console.log(result)
    res.status(result.code).send(result)
  })

module.exports = fileRoute  