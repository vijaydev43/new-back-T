const authDal = require('../dal/authDal')
const appHelper = require('../helper/helper')
const tokenHelper = require('../helper/tokenHelper')
const authController = new Object()

authController.createTokenForMobile = async (req) => {
    try {
      if(!req?.body?.phoneNo && !req?.body?.email){
        return appHelper.apiResponse(400, false, "Please provide user details", {});
      }
      let userData = await authDal.fetchUserByConsumerAndDeliveryman(req?.body);
      if (!userData?.status) {
        return appHelper.apiResponse(400, false, "User Not Found", "User Not Found");
      }
      if (userData?.data?.isBlocked ==true) {
        return appHelper.apiResponse(400, false, "User Has Blocked By Admin", "Verification Failed");
      }
      if (!userData?.data?.deleted) {
        console.log("userid ", userData?.data?.id)
        let token = tokenHelper.generateAccessToken(userData?.data?.id, userData?.data?.phoneNo, userData?.data?.secretKey);
        const decodeToken = tokenHelper.decodeAccessToken(token);
        console.log("token checn", decodeToken)
        if (token) {
          let response = {
            token: token, 
            data: {
              userName: userData?.data?.name,
              email: userData?.data?.email,
              userId: userData?.data?.id,
              phoneNo: userData?.data?.phoneNo,
              role: userData?.data?.role,
              uuid: userData?.data?.uuid
            }
          };
          return appHelper.apiResponse(200, true, "Login Successful", response);
        }
      } else {
        return appHelper.apiResponse(400, false, "User Not Verified from admin end", "Verification Failed");
      }
  
  
    } catch (error) {
      return appHelper.apiResponse(500, false, error.message ? error.message : "Internal Server Error")
    }
}

module.exports = authController