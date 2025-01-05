const express = require ("express")
const subCateController = require("../controller/tiftoProduct/subCateController")
const subCateRoute = express.Router()

subCateRoute.route('/')
    .post (async(req,res) => {
        let result = await subCateController.addCategory(req)
        res.status(result.code).send(result)
    })
subCateRoute.route('/')
    .get (async(req,res) => {
        let result = await subCateController.getCategory(req)
        res.status(result.code).send(result)
    })

subCateRoute.route('/')
    .put(async(req,res) => {
        let result = await subCateController.updateCategory(req)
        res.status(result.code).send(result)
    })

subCateRoute.route('/delete')
    .post (async(req,res) => {
        let result = await subCateController.deleteCategory(req)
        res.status(result.code).send(result)
    })    

module.exports = subCateRoute    