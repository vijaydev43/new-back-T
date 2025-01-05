const express = require('express')
const productCateRoute = express.Router()
const productCateController = require('../controller/productCateController')

productCateRoute.route('/')
    .post (async(req,res) => {
        let result = await productCateController.addCategory(req)
        res.status(result.code).send(result)
    })

productCateRoute.route('/')
    .get (async(req,res) => {
        let result = await productCateController.getCategory(req)
        res.status(result.code).send(result)
    })

productCateRoute.route('/')
    .put(async(req,res) => {
        let result = await productCateController.updateCategory(req)
        res.status(result.code).send(result)
    })

productCateRoute.route('/delete')
    .post (async(req,res) => {
        let result = await productCateController.deleteCategory(req)
        res.status(result.code).send(result)
    })

// productCateRoute.route('/list')
//     .get (async (req,res) => {
//         let result = await productCateController.categoryList(req)
//         res.status(result.code).send(result)
//     })

module.exports =  productCateRoute