const express=require('express')
const adminContoller=require('../controller/adminController')
const adminRoute=express()

adminRoute.post('/login',adminContoller.adminLogin)





module.exports=adminRoute;