const adminAuthDal = require("../dal/adminAuthDal");
const appHelper = require("../helper/helper")
const tokenHelper = require('../helper/tokenHelper')
const templateHelper = require('../helper/templateHelper')
const mailHelper = require("../helper/mailHelper")
const bcrypt = require('bcrypt');
const { app } = require("firebase-admin");
const adminAuthController = new Object()


adminAuthController.addAdminUser = async (req) => {
    try {
        let password = "";
        let body = req?.body ? req.body : undefined
        if (body?.email) {
            let check = await adminAuthDal.validateEmail(body)
            if (check.status) {
                return appHelper.apiResponse(400, false, "Email Already Exists", {})
            }
        }
        if (body?.phoneNo) {
            let check = await adminAuthDal.validatePhone(body)
            if (check.status) {
                return appHelper.apiResponse(400, false, "MobileNo Already Exists", {})
            }
        }
        if (body?.password) {
            password = await bcrypt.hash(body?.password ? body.password : "987654321abcdef", 7);
            body['password'] = password
        }
        let newPassword = await tokenHelper.passwordGenerator;
        console.log("new pas", newPassword)
        password = await bcrypt.hash(newPassword ? newPassword : "987654321abcdef", 7);
        body['password'] = password
        const uniqueNumber = Date.now() + Math.floor(Math.random() * 1000);
        body["uuid"] = uniqueNumber;
        // body.isVerified = true;
        body["secretKey"] = await appHelper.randomString(10);
        let adminUserList = await adminAuthDal.addAdminUser(body)
        if (adminUserList.status) {
            const mailTemplate = await templateHelper.mailPasswordTemplate(newPassword);
            await mailHelper.sendMailForUserVerification(body?.email, "Fast-X your login password", mailTemplate);
            return appHelper.apiResponse(200, true, adminUserList.message, adminUserList.data)
        }
        return appHelper.apiResponse(400, false, adminUserList.message, {})
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

adminAuthController.registerAdminUser = async (req) => {
    try {
        let password = "";
        let body = req?.body ? req.body : undefined
        if (body?.email) {
            let check = await adminAuthDal.validateEmail(body)
            if (check.status) {
                return appHelper.apiResponse(400, false, "Email Already Exists", {})
            }
        }
        if (body?.phoneNo) {
            let check = await adminAuthDal.validatePhone(body)
            if (check.status) {
                return appHelper.apiResponse(400, false, "MobileNo Already Exists", {})
            }
        }
        if (body?.password) {
            password = await bcrypt.hash(body?.password ? body.password : "987654321abcdef", 7);
            body['password'] = password
        }
        if(body?.role == "subAdmin"){
           return appHelper.apiResponse(400, false, "Sub Admin Type is needed !!", {})
        }
        let newPassword = await tokenHelper.passwordGenerator;
        password = await bcrypt.hash(newPassword ? newPassword : "987654321abcdef", 7);
        body['password'] = password
        const uniqueNumber = Date.now() + Math.floor(Math.random() * 1000);
        body["uuid"] = uniqueNumber;
        body["secretKey"] = await appHelper.randomString(10);
        let adminUserList = await adminAuthDal.registerAdminUser(body)
        if (adminUserList.status) {
            const mailTemplate = await templateHelper.mailPasswordTemplate(newPassword);
            await mailHelper.sendMailForUserVerification(body?.email, "Fast-X your login password", mailTemplate);
            return appHelper.apiResponse(200, true, adminUserList.message, adminUserList.data)
        }
        return appHelper.apiResponse(400, false, adminUserList.message, {})
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

adminAuthController.getAdminUser = async (req) => {
    try {
        let adminUserList = await adminAuthDal.getAllAdmin(req?.query)
        if (adminUserList) {
            return appHelper.apiResponse(200, true, adminUserList.message, adminUserList.data)
        }
        return appHelper.apiResponse(400, false, adminUserList.message, adminUserList.data)
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : 'Internal Server Errors')
    }
}

adminAuthController.getAdminUserById = async(req)=>{
    try{
        let addAdminUser = await adminAuthDal.getAdminUserById(req?.query)
        if(addAdminUser){
            return appHelper.apiResponse(200,true,addAdminUser.message,addAdminUser.data)
        }
        return appHelper.apiResponse(400,false,"Admin not found")
    }
    catch(err){
        return appHelper.apiResponse(500, false, err?.message ? err.message : 'Internal Server Errors')
    }
}
adminAuthController.finduserById = async(req)=>{
    try{
        let addAdminUser = await adminAuthDal.finduserById(req?.params)
        if(addAdminUser){
            return appHelper.apiResponse(200,true,addAdminUser.message,addAdminUser.data)
        }
        return appHelper.apiResponse(400,false,"Admin not found")
    }
    catch(err){
        return appHelper.apiResponse(500, false, err?.message ? err.message : 'Internal Server Errors')
    }
}

adminAuthController.updateAdminUser = async (req) => {
    try {
        let password = "";
        let body = req?.body ? req.body : undefined
        if (body?.phoneNo) {
            let check = await adminAuthDal.validatePhone(body)
            if (check.status) {
                return appHelper.apiResponse(400, false, "Mobile number Already Taken", {})
            }
        }
        if (body?.email) {
            let check = await adminAuthDal.validateEmail(body)
            if (check.status) {
                return appHelper.apiResponse(400, false, "Email Already Exists", {})
            }
        }
        if (body?.password) {
            password = await bcrypt.hash(body?.password, 7);
            body['password'] = password
        }
        let adminUserList = await adminAuthDal.updateAdminUser(body)
        if (adminUserList.status) {
            return appHelper.apiResponse(200, true, adminUserList.message, adminUserList.data)
        }
        return appHelper.apiResponse(400, false, adminUserList.message, {})
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

adminAuthController.login = async (req) => {
    try {
        let body = req?.body ? req.body : undefined
        let userData = await adminAuthDal.validateEmail(body);
        if (!userData?.status) {
            return appHelper.apiResponse(400, false, "Admin User Not Found", {});
        }
        if (userData?.data?.isBlocked==true) {
            return appHelper.apiResponse(400, false, "Admin User Not Blocked From Admin", {});
        }
       if(body?.password){
        const isMatch = await bcrypt.compare(req.body.password, userData?.data?.password);
        console.log("match ", isMatch)
        if (!isMatch) {
            return appHelper.apiResponse(400, true, "Password mismatched", {})
        }
       }
        let token = tokenHelper.generateAccessToken(userData?.data?._id, userData?.data?.phoneNo, userData?.data?.secretKey);
        const decodeToken = tokenHelper.decodeAccessToken(token);
        console.log("decoded token", decodeToken)
        if (token) {
            userData.data.token = token
            return appHelper.apiResponse(200, true, "Login Successfully", userData.data)
        }
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

//change password
adminAuthController.changePasswordAdmin = async (req) => {
    try {
        const body = req?.body;

        if (!body?.adminUserId) {
            return appHelper.apiResponse(400, false, "Please provide adminUserId", {});
        }

        if (!body?.oldPassword) {
            return appHelper.apiResponse(400, false, "Please provide oldPassword", {});
        }

        if (!body?.newPassword) {
            return appHelper.apiResponse(400, false, "Please provide newPassword", {});
        }

        const adminUserId = body.adminUserId;
        const check = await adminAuthDal.finduserById(adminUserId);

        if (!check?.status) {
            return appHelper.apiResponse(400, false, "User not found", {});
        }

        const oldPasswordHash = check.data?.password;
        if (!oldPasswordHash) {
            return appHelper.apiResponse(500, false, "Stored password is invalid", {});
        }

        const isMatch = await bcrypt.compare(body.oldPassword, oldPasswordHash);
        if (!isMatch) {
            return appHelper.apiResponse(400, false, "Incorrect old password", {});
        }

        const newPasswordHash = await bcrypt.hash(body.newPassword, 7);
        body.password = newPasswordHash;

        const updatedAdminUser = await adminAuthDal.updateAdminUser(body);
        if (updatedAdminUser?.status) {
            return appHelper.apiResponse(200, true, updatedAdminUser.message, updatedAdminUser.data);
        }

        return appHelper.apiResponse(500, false, "Failed to update password", {});

    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message || "Internal Server Error", {});
    }
};

//forgotPassword password
adminAuthController.forgotPasswordAdmin = async (req) => {
    try {
        let body = req?.body ? req.body : undefined
        if (!body.email || !body.adminUserType) {
            return appHelper.apiResponse(400, false, "Please provide email ", {})
        }
        let checkEmail = await adminAuthDal.validateEmail(body)
        if (!checkEmail.status) {
            return appHelper.apiResponse(400, false, "User not found", {})
        }
        if(checkEmail.data.role !== body?.adminUserType){
            return appHelper.apiResponse(400,false,"This Email is Not Found in Particular User Type",{})
        }
        let id = checkEmail.data._id
        let password = await bcrypt.hash(body?.newPassword, 7);
        console.log("password", body?.newPassword)
        body['password'] = password
        body['adminUserId']=id;
        let adminUserList = await adminAuthDal.updateAdminUser(body)
        if (adminUserList.status) {
            return appHelper.apiResponse(200, true, adminUserList.message, adminUserList.data)
        }
        return appHelper.apiResponse(400, true, "User not found", {})
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

adminAuthController.updateAdminUser = async (req) => {
    try {
        let password = "";
        let body = req?.body ? req.body : undefined
        if (body?.mobileNo) {
            let check = await adminAuthDal.validatePhone(body)
            if (check.status) {
                return appHelper.apiResponse(400, false, "Mobile number Already Taken", {})
            }
        }
        if (body?.email) {
            let check = await adminAuthDal.validateEmail(body)
            if (check.status) {
                return appHelper.apiResponse(400, false, "Email Already Exists", {})
            }
        }
        if (body?.password) {
            password = await bcrypt.hash(body?.password, 7);
            body['password'] = password
        }
        let adminUserList = await adminAuthDal.updateAdminUser(body)
        if (adminUserList.status) {
            return appHelper.apiResponse(200, true, adminUserList.message, adminUserList.data)
        }
        return appHelper.apiResponse(400, false, adminUserList.message, {})
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

adminAuthController.deleteAdminUser = async (req) => {
    try {
        let id = req?.body?.adminUserId ? req.body.adminUserId : undefined
        let adminUserList = await adminAuthDal.deleteAdminUser(id)
        if (adminUserList.status) {
            return appHelper.apiResponse(200, true, adminUserList.message, adminUserList.data)
        }
        return appHelper.apiResponse(400, false, adminUserList.message, {})
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}
module.exports = adminAuthController