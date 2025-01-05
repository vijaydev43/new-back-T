const userModel = require('../model/authModels/userAuthModels');
const { Types } = require("mongoose");
const appHelper = require('../helper/helper');
const userDal = new Object();
// const excelExportHelper = require('../helper/excelConverter');
const dataTypeService=require('../services/dataTypeService')

// user
userDal.createUser = async (data) => {
  try {

    let payload = new userModel(data);
    let result = await payload.save();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}

userDal.validatePhone = async (data) => {
    try {
      let query = [{ deleted: false }];
      if (data?.phoneNo) {
        query.push({ phoneNo: data?.phoneNo })
      }
      let result = await userModel.find({ $and: query }).lean();
      if (!result.length) {
        return { status: false, data: result };
      } else {
        return { status: true, data: result[0] };
      }
    } catch (err) {
      return { status: false, data: err.message ? err.message : err };
    }
};

userDal.validateEmail = async (data) => {
  try {
    let query = [{ deleted: false }];
    if (data?.email) {
      query.push({ email: data?.email });
    }
    let result = await userModel.find({ $and: query }).lean();
    console.log("res",result)
    if (!result.length) {
      return { status: false, data: result };
    } else {
      return { status: true, data: result[0] };
    }
  } catch (err) {
    return { status: false, data: err.message ? err.message : err };
  }
};

// userDal.createMobileOtp = async (data) => {
//   try {
//     console.log('Input data:', data);
//     let random;
//     if (data == '9876543210') {
//       random = '1111'
//     }
//     else {
//       random = appHelper.generateOTP(4);
//     }
//     const message = `Your verification code is ${random}. Please enter this code into the app/website to verify your mobile number. This code is valid for 5 minutes. Do not share this code with anyone. - EcoTec Engineers and Consultants`
//     await appHelper.send_sms(data, message, "1607100000000286417");
//     return { status: true, data: { phoneNo: data, otp: random } };
//   } catch (error) {
//     return { status: false, data: error.message ? error.message : error }
//   }
// }

userDal.findAllUser = async (req) => {
  try {
    let sort = req?.sort ? req.sort : "-createdAt";
    let offset = req?.offset ? req.offset : 0; //offset:default:0
    let limit = req?.limit ? req.limit : 10;    //limit:default:10
    let skip = offset * limit
    let query = [{ deleted: false }];
    let queryForActive = [{ deleted: false, status: false }];
    let queryForSuspend = [{ deleted: false,isBlocked:true }];
    if (req?.role) {
      query.push({ role: req?.role })
      queryForActive.push({ role: req?.role })
      queryForSuspend.push({ role: req?.role })
    }
    if (req?.status) {
      const status = await dataTypeService.covertBool(req?.status);
      query.push({ status: status })
    }
    if (req?.userId) {
      query.push({ _id: new Types.ObjectId(req.userId) })
    }

    if (req?.value) {
      query.push({
        "$or": [
          { "name": { "$regex": req.value, "$options": "i" } },
          { "uuid": { "$regex": req.value, "$options": "i" } },
          { "email": { "$regex": req.value, "$options": "i" } },
          { "phoneNo": { "$regex": req.value, "$options": "i" } },
        ]
      })
    }
    if (req?.fromDate && req?.toDate) {
      const startOfFromDate = new Date(req.fromDate);
      startOfFromDate.setHours(0, 0, 0, 0); // Set to the start of the fromDate

      const endOfToDate = new Date(req.toDate);
      endOfToDate.setHours(23, 59, 59, 999); // Set to the end of the toDate

      const dateFilter = { $gte: startOfFromDate, $lte: endOfToDate };
      query.push({ createdAt: dateFilter })
      queryForActive.push({ createdAt: dateFilter })
      queryForSuspend.push({ createdAt: dateFilter })
      // queryForRequest.push({ createdAt: dateFilter })

    }
    if (req?.date) {
      const startOfDay = new Date(req.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(req.date);
      endOfDay.setHours(23, 59, 59, 999);
      const dateFilter = { $gte: startOfDay, $lte: endOfDay };
      query.push({ createdAt: dateFilter });
      queryForActive.push({ createdAt: dateFilter })
      queryForSuspend.push({ createdAt: dateFilter })
      // queryForRequest.push({ createdAt: dateFilter })

    }
    console.log("query", query)
    let totalCount = await userModel.find({ $and: query }).countDocuments();
    let activeUser = await userModel.find({ $and: queryForActive }).countDocuments();
    let suspendedUser = await userModel.find({ $and: queryForSuspend }).countDocuments();
    let result = await userModel.aggregate()
        .match({ $and: query })
        .sort(sort)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .exec();
    let response = {
        totalCount: totalCount ? totalCount : 0,
        fetchCount: result?.length ? result.length : 0,
        activeUser: activeUser,
        suspendedUser: suspendedUser,
        data: result,
      }
      if (result) {
        return { status: true, code: 200, message: "Data fetched successfully", data: response }
      }
      return { status: false, code: 409, message: `Failed to fetch data`, data: {} 
    }
  } catch (error) {
    return { code: 500, status: false, message: `Database Error`, data: error.message }
  }
}

userDal.findUserById = async (id) => {
  try {
    let query = [{deleted:false}];
    if (id) {
      query.push({ _id: new Types.ObjectId(id) });
    }
    let result = await userModel.aggregate()
      .match({ $and: query })
      .exec();
    if (result) {
      return { status: true, data: result[0]}
    }
    return { status: false, data: result }
  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}

userDal.getTotalUserCount = async () => {
  try {
    let result = await userModel.find().countDocuments().exec();
    if (result) {
      return result;
    }
    return 10;
  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}
userDal.updateUserById = async (id, data) => {
  try {
    let result = await userModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result };
  } catch (error) {
    return { status: false, data: error.message ? error.message : error };
  }
}


userDal.findUserByNumber = async (req) => {
  try {
    console.log(`g ${req?.phoneNo}`);
    let query = [{ deleted: false }];

    if (req?.phoneNo) {
      query.push({
        "$or": [
          { "phoneNo": { "$regex": req.phoneNo, "$options": "i" } }
        ]
      })
    }
    // let result = await userModel.find({ $and: query });
    let result = await userModel.aggregate()
      .match({ $and: query }).project({
        _id: 1,
        // phoneNo: 1,
      });
    if (result?.length) {
      let response = {
        data: result,
        id: result[0]["_id"],
        totalCount: result?.length ? result.length : 0
      }
      return { status: true, message: "User details fetched successfully", data: response }
    } else {
      return { status: false, message: "No User Found", data: [] }
    }

  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}

//user list generate Excel

userDal.toGenerateExcelReport = async (req) => {
  try {
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    let query = [{ deleted: false }];
    if (req?.userType) {
      query.push({ role: req?.userType })
    }
    if (req?.isVerified) {
      query.push({ isVerified: req?.isVerified })
    }
    if (req?.status) {
      query.push({ status: req?.status })
    }
    if (req?.userId) {
      query.push({ _id: new Types.ObjectId(req.userId) })
    }
    if (req?.parentAdminUserId) {
      query.push({ parentAdminUserId: new Types.ObjectId(req.parentAdminUserId) })
    }
    if (req?.value) {
      query.push({
        "$or": [
          { "name": { "$regex": req.value, "$options": "i" } },
          { "uuid": { "$regex": req.value, "$options": "i" } },
          { "email": { "$regex": req.value, "$options": "i" } },
          { "phoneNo": { "$regex": req.value, "$options": "i" } },
        ]
      })
    }
    if (req?.fromDate && req?.toDate) {
      const startOfFromDate = new Date(req.fromDate);
      startOfFromDate.setHours(0, 0, 0, 0); // Set to the start of the fromDate

      const endOfToDate = new Date(req.toDate);
      endOfToDate.setHours(23, 59, 59, 999); // Set to the end of the toDate

      const dateFilter = { $gte: startOfFromDate, $lte: endOfToDate };
      query.push({ createdAt: dateFilter })
    }
    if (req?.date) {
      const startOfDay = new Date(req.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(req.date);
      endOfDay.setHours(23, 59, 59, 999);
      const dateFilter = { $gte: startOfDay, $lte: endOfDay };
      query.push({ createdAt: dateFilter });
    }
    let result = await userModel.aggregate()
      .match({ $and: query })
      //   .lookup({ from: 'trips', localField: '_id', foreignField: 'orderId', as: 'tripDetails' })
      //   .unwind({ path: "$tripDetails", preserveNullAndEmptyArrays: true })
      .sort({ "createdAt": 1, })
      .exec();
    let userList = [];
    let base64Data = '';
    for (let value of result) {
      let fullAddress = `${value?.address?.fullAddress ? value.address?.fullAddress : ''}`;
      let pincode = `${value?.address?.postalCode ? value.address?.postalCode : ''}`;
      userList.push({
        registerDate: new Date(value?.createdAt).toLocaleDateString('en-US', dateOptions),
        name: value?.name,
        email: value?.email,
        mobile: value?.phoneNo,
        uuid: value?.uuid,
        role: value?.role,
        lastSeen: value?.lastSeen,
        fullAddress: fullAddress,
        pincode: pincode,
        mobile: value?.phoneNo,
        //totalOrders: 0
      })
    }
    base64Data = await excelExportHelper.excelExport(userList);


    if (result) {
      return { status: true, code: 200, message: "Data fetched successfully", data: base64Data }
    }


  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}
module.exports = userDal;