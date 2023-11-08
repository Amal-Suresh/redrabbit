const express=require('express')
const adminController=require('../controller/adminController')
const productController=require('../controller/productContoller')
const riderController =require('../controller/riderController')
const categoryController = require('../controller/categoryController')
const orderController = require('../controller/orderController')
const AdminAuth = require('../middleware/auth')
const adminRoute=express()
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
      const name = Date.now()+"-"+file.originalname;
      cb(null, name, function(error, success) {
        if (error) {
          console.log(error);
        }
      });
    }
  });
  const upload = multer({ storage: storage });

adminRoute.post('/checkIfAdmin',adminController.checkIfAdmin)

adminRoute.post('/login',adminController.adminLogin)
adminRoute.post('/addProduct',upload.single('image'),productController.addProduct)
adminRoute.delete('/deleteProduct',productController.deleteProduct)
adminRoute.patch('/updateProduct',upload.single('image'),productController.updateProduct)
adminRoute.patch('/changeProductStatus',productController.productChangeStatus)
adminRoute.get('/findAllProducts',productController.findAllProducts)
adminRoute.get('/findSingleProduct',productController.findProduct)

adminRoute.get('/UserList',adminController.getUserList)
adminRoute.patch('/changeUserStatus',adminController.blockUnblockUser)

adminRoute.post('/addNewRider',upload.single('image'),riderController.createRider)
adminRoute.delete('/deleteRider',riderController.deleteRider)
adminRoute.patch('/updateRider',upload.single('image'),riderController.updateRider)
adminRoute.patch('/changeRiderStatus',riderController.riderChangeStatus)
adminRoute.get('/fetchAllRiders',riderController.findAllRiders)
adminRoute.get('/fetchSingleRider',riderController.findRider)


adminRoute.post('/addCategory',upload.single('image'),categoryController.addCategory)
adminRoute.patch('/editCategory',upload.single('image'),categoryController.editCategory)
adminRoute.patch('/list',categoryController.listCategory)
adminRoute.patch('/unlist',categoryController.unlistCategory)
adminRoute.delete('/deleteCategory',categoryController.deleteCategory)
adminRoute.get('/getCategory',categoryController.getCategory)

adminRoute.post('/orderManage',AdminAuth.adminAuth,orderController.orderManage)
adminRoute.get('/getallOrders',AdminAuth.adminAuth,orderController.getallOrders)




module.exports=adminRoute;