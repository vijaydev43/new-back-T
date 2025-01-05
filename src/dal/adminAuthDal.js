const adminModel = require('../model/authModels/adminModels')
const adminAuthDal = new Object ()
const {Types} = require("mongoose")

adminAuthDal.addAdminUser = async (req) => {
  try {
    let payload = new adminModel(req);
    let result = await payload.save();
    if (result) {
      return { status: true, message: "Admin User Added Successfully", data: result };
    }
    return { status: false, message: "Failed to Add Admin User", data: {} };
  } catch (err) {
    return { status: false, data: err?.message ? err.message : err }
  }
}

  adminAuthDal.validateEmail = async (data) => {
    try {
      let query = [{ deleted: false }];
      if (data?.email) {
        query.push({ email: data?.email });
      }
      let result = await adminModel.find({ $and: query }).lean();
      if (!result.length) {
        return { status: false, data: result };
      } else {
        return { status: true, data: result[0] };
      }
    } catch (err) {
      return { status: false, data: err.message ? err.message : err };
    }
  };

adminAuthDal.validatePhone = async (data) => {
    try {
      let query = [{ deleted: false }];
      if (data?.phoneNo) {
        query.push({ phoneNo: data?.phoneNo })
      }
      let result = await adminModel.find({ $and: query }).lean();
      if (!result.length) {
        return { status: false, data: result };
      } else {
        return { status: true, data: result[0] };
      }
    } catch (err) {
      return { status: false, data: err.message ? err.message : err };
    }
};

adminAuthDal.finduserById = async (id) => {
    try {
      let result = await adminModel.find({ _id: new Types.ObjectId(id) }).exec();
      if (result) {
        return { status: true, data: result[0] }
      }
      return { status: false, data: [] }
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
  }

adminAuthDal.registerAdminUser = async (req) => {
    try {
      let payload = new adminModel(req);
      let result = await payload.save();
      if (result) {
        return { status: true, message: "Admin Registered Successfully", data: result };
      }
      return { status: false, message: "Failed to Register Admin ", data: {} };
    } catch (err) {
      return { status: false, data: err?.message ? err.message : err }
    }
  }    


adminAuthDal.getAdminUserById = async (req) => {
    try {
      let query = [{ deleted: false }]
      if (req?.userName) {
        query.push({ userName: req.userName })
      }
      if (req?.adminUserId) {
        query.push({ _id: new Types.ObjectId(req.adminUserId) })
      }
      let result = await adminModel.find({ $and: query }).exec()
      if (result.length) {
        return { status: true, message: "Admin User Details", data: result[0] }
      }
      return { status: false, message: "No Admin Users Found", data: {} }
    } catch (err) {
      return { status: false, data: err?.message ? err.message : err }
    }
  }  

adminAuthDal.getAllAdmin = async(req)=>{
  try{
    let offset = req?.offset ? req.offset : 0;
    let limit = req?.limit ? req.limit : 10;
    let skip = offset * limit;
    let query = [{ deleted: false, }];
    if (req?.subAdminType) {
      query.push({ subAdminType: req?.subAdminType })
      // queryForActive.push({ subAdminType: req?.subAdminType })
      // queryForSuspend.push({ subAdminType: req?.subAdminType })
    }
    if (req?.adminUserId) {
      query.push({ _id: new Types.ObjectId(req.adminUserId) })
    }
    if (req?.userName) {
      query.push({ userName: req.userName })
    }
    if (req?.role) {
      query.push({ role: req.role })
    }
    let totalCount = await adminModel.find({ $and: query }).countDocuments().exec()
    let result = await adminModel
    .aggregate().match({ $and: query })
      // .lookup({
      //   from: 'orders', localField: '_id', foreignField: 'vendorAdminId',
      //   as: 'orderDetails'
      // })
      // .addFields({
      //   totalOrders: { $size: '$orderDetails' }  // Add a new field `totalOrders` with the count of `orderDetails`
      // }).project({
      //   orderDetails: 0

      // })
      .sort('-createdAt')
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec()
      let response = {
        totalCount: totalCount ? totalCount : 0,
        fetchCount: result?.length ? result.length : 0,
        AdminUserList: result
      }
      if (result.length) {
        return { status: true, message: "Admin User Lists", data: response }
      }
      return { status: false, message: "No Admin Users Found", data: response }
  }
  catch(err){
    return { status: true, data: err?.message ? err.message : err }
  }
}  

adminAuthDal.updateAdminUser = async (req) => {
    try {
      let result = await adminModel.findOneAndUpdate({ _id: new Types.ObjectId(req?.adminUserId) }, req, { new: true }).exec();
      if (result) {
        return { status: true, message: "Admin User Details Updated", data: result };
      }
      return { status: false, message: "Failed to Update Admin User Details", data: {} };
    }
    catch (err) {
      return { status: false, data: err?.message ? err.message : err }
    }
  
  }  

adminAuthDal.deleteAdminUser = async (id) => {
    try {
      let payload = {
        deleted: true,
      }
      const find = { _id: id }
      const set = { $set: payload }
      const options = { upsert: false, new: true }
  
      let result = await adminModel.findOneAndUpdate(find, set, options).exec();
      if (result) {
        return { status: true, message: "Admin User Deleted", data: {} }
      }
      return { status: false, message: "Failed to Delete Admin User", data: {} }
    } catch (err) {
      return { status: false, data: err.message ? err.message : err };
    }
  }  
module.exports = adminAuthDal  