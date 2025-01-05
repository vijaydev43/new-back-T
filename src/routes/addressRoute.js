const express = require('express')
const addressController = require("../controller/addressController")
const addressRoute = express.Router()

addressRoute.route("/")
  .post(async (req, res) => {
    let result = await addressController.createAddress(req);
    res.status(result.code).send(result)
})

addressRoute.route('/')
.get(async (req, res) => {
    let result = await addressController.getAddresses(req);
    res.status(result.code).send(result)
})

addressRoute.route("/:addressId")
  .get(async (req, res) => {
    let result = await addressController.findAddressById(req);
    res.status(result.code).send(result)
})
addressRoute.route("/:addressId")
  .put(async (req, res) => {
    console.log("id",req?.params?.addressId)
    let result = await addressController.updateAddressByAddressId(req);
    res.status(result.code).send(result)
})
addressRoute.route("/:addressId")
  .delete(async (req, res) => {
    let result = await addressController.deleteAddressByAddressId(req);
    res.status(result.code).send(result)
})


module.exports = addressRoute
