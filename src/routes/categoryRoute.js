const express = require('express')
const categoryRoute = express.Router()
const categoryController = require('../controller/tiftoProduct/categoryController')

categoryRoute.route('/')
    .post (async(req,res) => {
        let result = await categoryController.addCategory(req)
        res.status(result.code).send(result)
})

categoryRoute.route('/')
    .get (async(req,res) => {
        let result = await categoryController.getCategory(req)
        res.status(result.code).send(result)
})

categoryRoute.route('/:categoryId')
    .get (async(req,res) => {
        let result = await categoryController.getCategoryById(req)
        res.status(result.code).send(result)
})

categoryRoute.route('/:categoryId')
    .put(async(req,res) => {
        let result = await categoryController.updateCategory(req)
        res.status(result.code).send(result)
})

categoryRoute.route('/delete')
    .post (async(req,res) => {
        let result = await categoryController.deleteCategory(req)
        res.status(result.code).send(result)
})

// productCateRoute.route('/list')
//     .get (async (req,res) => {
//         let result = await productCateController.categoryList(req)
//         res.status(result.code).send(result)
//     })

module.exports =  categoryRoute