const addressDal = require("../dal/addressDal")
const userDal = require("../dal/userAuthDal")
const appHelper = require("../helper/helper")
const addressController = new Object ()

addressController.createAddress = async(req,res)=>{
    try{
        let body = req?.body ? req.body : undefined
        if (!body?.userId) {
            body["userId"] = req?.headers?.userid ? req?.headers.userid : undefined;
        }
        let payU = {
            userId: body["userId"]
        }
        let addressCount = await addressDal.findAllAdress(payU)
        if (addressCount?.data?.totalCount >=10) {
            return appHelper.apiResponse(400, false, "Address Limit Count Exceed")
        }
        let payload = {
            userId: body["userId"],
            addressType: body["addressType"],
        }
        if (body["addressType"] != "Other") {
            let fetchAddressByUserId = await addressDal.findAllAdress(payload);
            if (fetchAddressByUserId?.status) {
              return appHelper.apiResponse(400, false, `User already added ${body["addressType"]} `, {})
            }
        }
        console.log("success check")            
        let result = await addressDal.createAddress(body);
        if (result.status) {
          if (result?.data.type == "primary") {
            let pay = {
              userId: body["userId"]
            }
            console.log("user adar", result?.data._id)
            let getAllAddressByUserId = await addressDal.findAllAdress(pay);
            if (getAllAddressByUserId?.status) {
              for (let value of getAllAddressByUserId.data.AdminUserList) {
                console.log("id", value._id)
                if (result?.data._id.toString() != value._id.toString()) {
                  console.log(result?.data._id.toString() , value._id.toString())
                  await addressDal.updateAddressByAddressId(value._id, { type: "secondary" });
    
                }
    
              }
            }
    
          }
    
          return appHelper.apiResponse(200, true, "Address saved successfully", result.data)
        }
        return appHelper.apiResponse(400, false, "Failed to save address", result)
    }
    catch(error){
        return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

addressController.findAllAdress = async (req) => {
    try {
      let result = await addressDal.findAllAdress(req?.query);
      if (result.status) {
        return appHelper.apiResponse(200, true, result.message, result.data)
      }
      return appHelper.apiResponse(400, false, "failed to fetch address details", result.data)
    } catch (error) {
      return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

addressController.findAddressById = async (req) => {
    try {
      let id = req?.params?.addressId;
      let result = await addressDal.findAddressById(id);
      if (result.status) {
        return appHelper.apiResponse(200, true, "Data fetched successfully", result.data)
      }
      return appHelper.apiResponse(400, false, "Failed to fetch data", {})
    } catch (error) {
      return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}
addressController.updateAddressByAddressId = async (req) => {
    try {
      let id = req?.params?.addressId ? req.params.addressId : undefined;
      console.log("address id", id)
      let body = req?.body
      body.query = {};
      if (body?.address?.latitude && body?.address?.longitude) {
        req.query["deleted"] = false;
        req.query["addressId"] = req?.params?.addressId;
        req.query["userId"] = body?.userId;
        req.query["latitude"] = body?.latitude;
        req.query["longitude"] = body?.longitude;
        console.log(req?.query)
        let checkLatLongExist = await addressDal.findAllAdress(req?.query);
        if (checkLatLongExist?.data?.data?.length) {
          return appHelper.apiResponse(400, false, "Failed to save address", "Address Already Exist")
        }
      }
      let updateUser = await addressDal.updateAddressByAddressId(id, body);
      if (updateUser?.status) {
        updateUser.data["addressId"] = id;
        console.log("user adar", updateUser?.data)
        let getAllAddressByUserId = await addressDal.findAllAdress(body);
        if (getAllAddressByUserId?.status) {
          for (let value of getAllAddressByUserId.data.AdminUserList) {
            if (id != value._id) {
              await addressDal.updateAddressByAddressId(value._id, { type: "secondary" });
  
            }
  
          }
        }
        return appHelper.apiResponse(200, true, "Address Updated Successfully", updateUser.data)
  
      }
      return appHelper.apiResponse(400, false, "Failed to update address", {})
    } catch (error) {
      return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}
addressController.deleteAddressByAddressId = async (req) => {
    try {
      let id = req?.params?.addressId ? req.params.addressId : undefined;
      let result = await addressDal.deleteAddressByAddressId(id);
      if (result.status) {
        return appHelper.apiResponse(200, true, "Address deleted successfully", result.data)
      }
      return appHelper.apiResponse(400, false, "Failed to delete address", result.data)
    } catch (error) {
      return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

module.exports = addressController