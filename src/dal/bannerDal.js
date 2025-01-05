const bannerModel = require('../model/bannerModel');
const bannerDal = new Object();


bannerDal.createBanner = async (data) => {
  try {
    let payload = new bannerModel(data);
    let result = await payload.save();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result }
  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }

}

bannerDal.findAllBanner = async (req) => {
  try {
    let queryArray = [{ deleted: false }];
    if (req?.status) {
      queryArray.push({ status: req.status })
    }
    if (req?.bannerType) {
      queryArray.push({ bannerType: req.bannerType })
    }
    if (req?.userType) {
      queryArray.push({ userType: req.userType })
    }
    if (req?.productType) {
      queryArray.push({ productType: req.productType })
    }
    if(req?.parentAdminUserId){
      queryArray.push({parentAdminUserId:req?.parentAdminUserId})
    }
    let result = await bannerModel.find({ $and: queryArray })
    .sort('-updatedAt')
    .limit(10)
    .exec();
    if (result) {
      let response = {
        data: result,
        totalCount: result?.length ? result.length : 0
      }
      return { status: true, message: "Banner fetched successfully", data: response }
    } else {
      return { status: false, message: "No Banners Found", data: [] }
    }

  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}
bannerDal.findBannerById = async (id) => {
  try {
    let result = await bannerModel.find({ _id: id }).exec();
    console.log(result)
    if (result) {
      return { status: true, data: result[0] };
    }
    return { status: false, data: {} };
  } catch (error) {
    return { status: false, data: error.message ? error.message : error };
  }
}
bannerDal.updateBannerByBannerId = async (id, data) => {
  try {
    let result = await bannerModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec();
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: result };
  } catch (error) {
    return { status: false, data: error.message ? error.message : error };
  }
}
bannerDal.deleteBannerByBannerId = async (id) => {
  let payload = {
    deleted: true
  }
  const find = { _id: id }
  const set = { $set: payload }
  const options = { upsert: false, new: true }

  let result = await bannerModel.findOneAndUpdate(find, set, options).exec();
  if (result) {
    return { status: true, data: {} }
  }
  return { status: false, data: result }
}
bannerDal.findClickBanner= async (id) => {
  try {
    let result = await bannerModel.find({ _id: id }).exec();
    console.log(result)
    if (result) {
      return { status: true, data: result[0] };
    }
    return { status: false, data: {} };
  } catch (error) {
    return { status: false, data: error.message ? error.message : error };
  }
}

module.exports = bannerDal;