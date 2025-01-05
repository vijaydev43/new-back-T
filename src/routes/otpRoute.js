const express = require("express")
const otpRoute = express.Router()
const otpController = require("../controller/otpController")

otpRoute.route('/requestOtp')
.post (async (req,res) => {
    console.log("route res",req)
    let result = await otpController.requestOtpEmail(req)
    res.status(result.code).send(result)
})

otpRoute.route('/verifyOtp')
    .post (async (req,res) => {
        console.log("route res",req)
        let result = await otpController.verifyOtp(req)
        res.status(result.code).send(result)
    })

module.exports = otpRoute
