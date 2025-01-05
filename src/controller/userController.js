const userController = new Object();
const { app } = require("firebase-admin");
const userDal = require("../dal/userAuthDal")
const appHelper = require("../helper/helper")
const tokenHelper = require('../helper/tokenHelper')
const bcrypt = require('bcrypt');
const { token } = require("morgan");
const otpController = require("./otpController");
const templateHelper = require("../helper/templateHelper");
const mailHelper = require("../helper/mailHelper")


userController.userRegister = async(req)=>{
    try{
        let body = req?.body
        if (!body?.phoneNo) {
            return appHelper.apiResponse(404, false, "Phone number is required");
        }
        if (!body?.email) {
            return appHelper.apiResponse(404, false, "Email is required");
        }
        if(body?.email){
            let emailCheck = await userDal.validateEmail(body)
            console.log("emailCheck",emailCheck)
            if(emailCheck.status){
                return appHelper.apiResponse(400,false,"Email Already Exits")
            }
        }
        if(body?.phoneNo){
            let phoneCheck = await userDal.validatePhone(body)
            if(phoneCheck.status){
                return appHelper.apiResponse(400,false,"Mobile number Already Exits")
            }
        }
        if(body?.password){
        let newPassword = body?.password
        password = await bcrypt.hash(newPassword ? newPassword : "987654321abcdef", 7);
        body['password'] = password
        }
           body["secretKey"] = await appHelper.randomString(10);
           const uniqueNumber = `TIF${Date.now() + Math.floor(Math.random() * 1000)}`;
           body["uuid"] = uniqueNumber;
     let result = await userDal.createUser(body)
     if(result){
        return appHelper.apiResponse(200,true,"User Registered Successfully",result)
     }      
        return appHelper.apiResponse(400,false,"User Resgisteration Failed!!")
    }
    catch (error) {
        return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

userController.login = async (req) => {
    try {
        let body = req?.body ? req.body : undefined;
        // Step 1: Validate email
        let userData = await userDal.validateEmail(body);
        if (!userData?.status) {
            return appHelper.apiResponse(400, false, "Admin User Not Found", {});
        }
        // Step 2: Check if user is blocked
        if (userData?.data?.isBlocked) {
            return appHelper.apiResponse(400, false, "User is Blocked From Admin", {});
        }
        //Step 3: Password validation
        console.log("Stored Hashed Password:", userData?.data?.password);
        console.log("Entered Plain Password:", body?.password);

        if (body?.password) {
            const isMatch = await bcrypt.compare(body.password, userData?.data?.password);
            console.log("Password Match:", isMatch);

            if (!isMatch) {
              console.error("Debugging Password Issue");
        console.error("Salt Rounds Used in Hash:", userData?.data?.password.split("$")[2]);
                return appHelper.apiResponse(400, false, "Password mismatched", {});
            }
        }
        // Step 4: Generate access token
        let token = tokenHelper.generateAccessToken(
            userData?.data?._id,
            userData?.data?.phoneNo,
            userData?.data?.secretKey
        );
        // Step 5: Return response
        if (token) {
            userData.data.token = token;
            return appHelper.apiResponse(200, true, "Login Successfully", userData.data);
        }

    } catch (err) {
        console.error("Error in login:", err);
        return appHelper.apiResponse(500, false, err?.message || "Internal Server Error");
    }
};


userController.updateUserById = async (req) => {
    try {
      let id = req?.params?.userId;
      let body = req?.body
      body["_id"] = id;
      if (body?.phoneNo) {
        let mobileCheck = await userDal.validateUserFromMobile(body);
        if (!mobileCheck.status) {
          return appHelper.apiResponse(400, true, "Validation Failed", "Mobile Number Already Exist");
        }
      }
      if (body?.email) {
        let emailCheck = await userDal.validateUserFromWeb(body);
        if (!emailCheck.status) {
          return appHelper.apiResponse(400, true, "Validation Failed", "Email Already Exist");
        }
      }
      if (body?.status == false) {
        let user = await userDal.findUserById(id); 
        if (user && user.data.activeStatus !== "offline") {
          return appHelper.apiResponse(400, false, "Cannot update status. Delivery man is not offline.", {});
        }
      }
      if(body?.password){
        let newPassword = await tokenHelper.passwordGenerator;
        password = await bcrypt.hash(newPassword ? newPassword : "987654321abcdef", 7);
        body['password'] = password
      }
      let updateUser = await userDal.updateUserById(id, body);
      console.log("upda",updateUser)
      let payload = {};
      if (body?.isVerified == "true") {
        payload["isVerified"] = true
      }
      if (body?.isVerified == "false") {
        payload["isVerified"] = false
      }
      if (body?.phoneNo) {
        payload["phoneNo"] = body.phoneNo
      }
      if (body?.email) {
        payload["email"] = body.email
      }
      if (body?.role) {
        payload["role"] = body.role
      }
      if (updateUser.status) {
        // if (body?.isVerified == true) {
        //   let notiPay= {
        //     body: {
        //       customerId: updateUser.data.id,
        //       title: utilitiesFile.notification.fastxName,
        //       body: `Your account has been verified!! kick start your journey with fastX!!`,
        //       notificationType: "deliveryman",
        //   }
        //   }
        //   await notificationController.createNotification(notiPay)
        //   const mailTemplate = await templateHelper.mailVerifiedTemplate("Your Account has been verified");
        //   await mailHelper.sendMailForUserVerification( updateUser.data?.email, "Your Account has been verified", mailTemplate);
        // }
        // else if(body?.isVerified == false){
        //   const mailTemplate = await templateHelper.mailVerifiedTemplate("Your request has been rejected");
        //   await mailHelper.sendMailForUserVerification( updateUser.data?.email, "Your request has been rejected",mailTemplate)
        // }
        return appHelper.apiResponse(200, true, "Data Updated Successfully", updateUser.data)
      }
      return appHelper.apiResponse(400, false, "Failed to update data", {})
    } catch (error) {
      return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

userController.deleteUserById = async (req) => {
    try {
      let id = req?.params?.userId;
      let payload = {
        deleted: true,
      }
      let result = await userDal.findUserById(id);
      if (!result.status) {
        return appHelper.apiResponse(400, false, "User details not found", result.data)
      }
      let updateUser = await userDal.updateUserById(id, payload);
      if (updateUser.status) {
        return appHelper.apiResponse(200, true, "Data deleted successfully", updateUser.data)
      }
      return appHelper.apiResponse(400, false, "Failed to delete data", result.data)
    } catch (error) {
      return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

userController.findAllUser = async(req)=>{
  try{
    let result = await userDal.findAllUser(req?.query)
    if(result){
      return appHelper.apiResponse(200,true,"User Fetched SuccessFully",result)
    }
    return appHelper.apiResponse(400,false,"Users Not Found",{})
  }
  catch (err) {
    return appHelper.apiResponse(500,false,"Internal Server error",err)
  }
}

userController.findUserById = async(req)=>{
  try{
    let result = await userDal.findUserById(req.query)
    if(result){
      return appHelper.apiResponse(200,true,"User Fetched SuccessFully",result)
    }
    return appHelper.apiResponse(400,false,"Users Not Found",{})
  }
  catch (err) {
    return appHelper.apiResponse(500,false,"Internal server error",err)
  }
}

module.exports= userController