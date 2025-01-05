const express = require ("express")
const productRoute = express.Router()
const productController = require("../controller/tiftoProduct/productController")


productRoute.route('/').post (async(req,res) => {
        let result = await productController.addProduct(req)
        res.status(result.code).send(result)
})

productRoute.route('/').get (async(req,res) => {
        let result = await productController.getproducts(req)
        res.status(result.code).send(result)
})

productRoute.route('/').put (async(req,res) => {
        let result = await productController.updateProducts(req)
        res.status(result.code).send(result)
})

productRoute.route('/').post (async(req,res) => {
        let result = await productController.deleteProducts(req)
        res.status(result.code).send(result)
})

module.exports = productRoute;