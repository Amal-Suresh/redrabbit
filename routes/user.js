const express=require('express')
const userRoute=express()
const userController = require('../controller/userController')
const orderController = require('../controller/orderController')
const auth = require('../middleware/auth')

userRoute.post('/userLogin',userController.userLogin)

userRoute.get('/products', userController.getProducts)
userRoute.post('/addtocart',auth.userAuth,userController.updateCart)
userRoute.get('/cart',auth.userAuth,userController.showCartData)

userRoute.post('/saveUserName',userController.saveUserName)
userRoute.post('/codOrder',auth.userAuth,orderController.CodOrder)
module.exports=userRoute;