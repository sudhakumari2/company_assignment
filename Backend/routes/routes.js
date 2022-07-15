const express = require('express')
const router=express.Router()
const controllerData=require("../controller/controller")
router.post("/csv",controllerData.CreateCsv)
router.get("/csv",controllerData.getAllData)

module.exports = router