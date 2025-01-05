const otpDal = new Object()
const otpModel = require('../model/otpModel')

otpDal.requestOtp = async (req) => {
    try {
        let payload = new otpModel(req);
        let result = await payload.save();
        if (result) {
          return { status: true, message: "OTP Generated Successfully", data: result };
        }
        return { status: false, message: "Failed to Generate OTP", data: {} };
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}

    }
}

otpDal.verifyOtp = async (req) => {
    try {
        let result = await otpModel.findOne({otpId : req?.otpId})
        if (result) {
            return { status: true, message: "OTP Details", data: result };
        }
        return { status: false, message: "Failed to Get OTP", data: {} };
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}
otpDal.deletedOTP = async (req) => {
    try {
        let result = await otpModel.deleteOne({otpId : req?.otpId})
        if (result) {
            console.log("otp has deleted",result)
            return { status: true, message: "OTP Details", data: result };
        }
        return { status: false, message: "Failed to Delete OTP", data: {} };
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}

module.exports = otpDal