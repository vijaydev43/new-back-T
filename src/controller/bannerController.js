const bannerDal = require('../dal/bannerDal');
const appHelper = require('../helper/helper');
const bannerController = new Object();
// const hashtagDal = require('../dal/common_dal/hashtagDal')



bannerController.createBanner = async (req) => {
    try {
        let body = req?.body ? req.body : {};
        let query = {
            parentAdminUserId: body?.parentAdminUserId,
            userType:body?.userType,
            productType:body?.productType,
            bannerType: body?.bannerType,
            status:true
        }
        console.log("query ", query)
        let bannerFetch = await bannerDal.findAllBanner(query);
        console.log("value ",JSON.stringify(bannerFetch?.data?.data.length) )
        if (bannerFetch?.data?.data?.length >=5) {
            return appHelper.apiResponse(400, false, "Failed to save Banner", "Banner Limit Count exceeded")
        }
        body["userId"] = req?.headers?.userid ? req?.headers.userid : undefined
        let result = await bannerDal.createBanner(body);
        if (result.status) {
            return appHelper.apiResponse(200, true, "Banner saved successfully", result.data)
        }
        return appHelper.apiResponse(400, false, "Failed to save Banner", result.data)
    } catch (error) {
        return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

bannerController.findAllBanner = async (req) => {
    try {
        let result = await bannerDal.findAllBanner(req?.query);
        if (result.status) {
            return appHelper.apiResponse(200, true, result.message, result.data)
        }
        return appHelper.apiResponse(400, false, "Failed to fetch banner details", result.data)
    } catch (error) {
        return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

bannerController.findBannerById = async (req) => {
    try {
        let id = req?.params?.bannerId;
        let result = await bannerDal.findBannerById(id);
        if (result.status) {
            return appHelper.apiResponse(200, true, "Data fetched successfully", result.data)
        }
        return appHelper.apiResponse(400, false, "Failed to fetch data", result.data)
    } catch (error) {
        return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

bannerController.updateBannerByBannerId = async (req) => {
    try {
        let id = req?.params?.bannerId ? req.params.bannerId : undefined;
        console.log("banner ", id)
        let body = req?.body
        let updateUser = await bannerDal.updateBannerByBannerId(id, body);
        if (updateUser.status) {
            return appHelper.apiResponse(200, true, "Banner Updated Successfully", updateUser.data)
        }
        return appHelper.apiResponse(400, false, "Failed to update banner", {})
    } catch (error) {
        return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}
bannerController.deleteBannerByBannerId = async (req) => {
    try {
        let id = req?.params?.bannerId ? req.params.bannerId : undefined;
        let result = await bannerDal.deleteBannerByBannerId(id);
        if (result.status) {
            return appHelper.apiResponse(200, true, "Banner deleted successfully", result.data)
        }
        return appHelper.apiResponse(400, false, "Failed to delete banner", result.data)
    } catch (error) {
        return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}


bannerController.findClickBanner = async (req) => {
    try {
        let result = await bannerDal.findClickBanner(req);
        if (result.status) {
            return appHelper.apiResponse(200, true, result.message, result.data)
        }
        return appHelper.apiResponse(400, false, "Failed to fetch banner details", result.data)
    } catch (error) {
        return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error")
    }
}

module.exports = bannerController;