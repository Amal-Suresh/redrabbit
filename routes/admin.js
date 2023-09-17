const express=require('express')
const adminController=require('../controller/adminController')
const productController=require('../controller/productContoller')
const riderController =require('../controller/riderController')
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

adminRoute.post('/login',adminController.adminLogin)
adminRoute.post('/addProduct',upload.single('image'),productController.addProduct)
adminRoute.delete('/deleteProduct',productController.deleteProduct)
adminRoute.patch('/updateProduct',upload.single('image'),productController.updateProduct)
adminRoute.patch('/changeProductStatus',productController.productChangeStatus)
adminRoute.get('/findAllProducts',productController.findAllProducts)

adminRoute.post('/addNewRider',upload.single('image'),riderController.createRider)
adminRoute.delete('/deleteRider',riderController.deleteRider)
adminRoute.patch('/updateRider',upload.single('image'),riderController.updateRider)
adminRoute.patch('/changeRiderStatus',riderController.riderChangeStatus)









module.exports=adminRoute;