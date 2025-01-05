const otpController = new Object()
const templateHelper = require('../helper/templateHelper')
const appHelper = require('../helper/helper')
const otpDal = require('../dal/otpDal')
const apiResponse = require('../helper/apiResponse')
const bcrypt = require('bcrypt');
const userDal = require("../dal/userAuthDal")
const { v4: uuidv4 } = require('uuid');
const mailHelper = require('../helper/mailHelper')
const adminAuthDal = require('../dal/adminAuthDal')


otpController.requestOtpEmail = async (req) => {
    try {
        let body = req?.body ? req.body : undefined
        let otp;
        if (body["type"] == "subAdmin") {
            let pay = {
                "email": body["email"],
            }
            let check = await adminAuthDal.validateEmail(pay)
            if (!check.status) {
                return appHelper.apiResponse(400, false, "sub-Admin Not Found", {})
            }
        }
        if (body["type"] == "admin") {
            let pay = {
                "email": body["email"],
            }
            let check = await adminAuthDal.validateEmail(pay)
            if (!check.status) {
                return appHelper.apiResponse(400, false, "Admin Not Found", {})
            }
        }
        if (body["type"] == "user") {
            let pay = {
                "email": body["email"],
            }
            let check = await userDal.validateEmail(pay)
            if (!check.status) {
                return appHelper.apiResponse(400, false, "User Not Found", {})
            }
        }
        if (body?.email) {
            otp = await appHelper.generateOTP(4);
            console.log("OTP", otp)
            const mailTemplate = await templateHelper.mailTemplate(otp);
            await mailHelper.sendMailForUserVerification(body?.email, "OTP Verification from Tifto", mailTemplate);
        }
        const hashedOtp = await bcrypt.hash(otp, 10);
        let otpId = uuidv4();
        let expirationTime = new Date(new Date().getTime() + 100000);
        // let saltRounds = 10;
        // let hashedOtp = await bcrypt.hash(otp, saltRounds);
        let payload = {
            otpId: otpId,
            otp: hashedOtp,
            OTP: otp,
            expirationTime: expirationTime
        }
        let add = await otpDal.requestOtp(payload)
        delete payload.otp;
        delete payload.OTP;
        delete payload.expirationTime;
        if (add.status) {
            return new apiResponse(200, true, "OTP has been Sent to Your Email", payload);
        }
        return new apiResponse(400, false, "Failed to Send OTP", {});

    } catch (err) {
        return new apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

otpController.verifyOtp = async (req) => {
    try {
        let body = req?.body ? req.body : undefined
        if (body?.otpId == "" || body?.otpId == null) {
            return new apiResponse(400, false, "Please Provide otpId", {});
        }
        let verify = await otpDal.verifyOtp(body)
        if (verify.status) {
            let otpRecord = verify?.data ? verify.data : {}
            if (otpRecord.expirationTime < new Date()) {
                await otpDal.deletedOTP(body)
                return new apiResponse(400, false, "OTP has expired", {})
            }
            let compareOtp = await bcrypt.compare(body?.otp, otpRecord.otp);
            if (!compareOtp) {
                return new apiResponse(400, false, "OTP mismatched", {})
            }
            await otpDal.deletedOTP(body)
            return new apiResponse(200, true, "OTP verified successfully", {});
        }
        return new apiResponse(400, false, "Invalid OTP ID Provided", {});
    } catch (err) {
        return new apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}
module.exports = otpController