const express=require('express')
const userRoute=express()
const userController = require('../controller/userController')
const auth = require('../middleware/auth')


userRoute.post('/userLogin',userController.userLogin)
userRoute.get('/products', userController.getProducts)
userRoute.post('/addtocart', userController.updateCart)
userRoute.get('/cart/:userId', userController.showCartData)

userRoute.post('/saveUserName',auth.userAuth,userController.saveUserName)




module.exports=userRoute;