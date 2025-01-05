const express = require("express");
const authController = require('../../controller/authController');
const authRoute = express.Router();


//consumer
authRoute.route("/token")
  .post(async (req, res) => {
    let result = await authController.createTokenForMobile(req);
    res.status(result.code).send(result)
})

module.exports = authRoute