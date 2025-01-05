const express = require("express");
const bannerController = require('../controller/bannerController');
const bannerRoute = express.Router();
  //mobile app banner recent history and popular 
  bannerRoute.route("/mobileAppBanner")
  .get(async (req, res) => {
    console.log("check");
    let result = await bannerController.bannerMobileGetList(req);
    res.status(result.code).send(result)
  })

bannerRoute.route("/")
  .post(async (req, res) => {
    let result = await bannerController.createBanner(req);
    res.status(result.code).send(result)
  })
bannerRoute.route("/")
  .get(async (req, res) => {
    let result = await bannerController.findAllBanner(req);
    res.status(result.code).send(result)
  })
bannerRoute.route("/:bannerId")
  .get(async (req, res) => {
    let result = await bannerController.findBannerById(req);
    res.status(result.code).send(result)
  })
bannerRoute.route("/:bannerId")
  .put(async (req, res) => {
    let result = await bannerController.updateBannerByBannerId(req);
    res.status(result.code).send(result)
  })
bannerRoute.route("/:bannerId")
  .delete(async (req, res) => {
    let result = await bannerController.deleteBannerByBannerId(req);
    res.status(result.code).send(result)
  })
bannerRoute.route("/clickBanner")
  .post(async(req,res) =>{
    let result = await bannerController.addUrlBanner(req)
    res.status(result.code).send(result)
  })


module.exports = bannerRoute;