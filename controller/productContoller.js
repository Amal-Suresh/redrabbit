const Product = require('../model/productModel')
const cloudinary = require('../utils/cloudnery')


const addProduct = async (req, res) => {
    try {
        const { name, discription, category, price } = req.body
        let imageUrl = ''
        let imageId = ''
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "productImg" })
            imageUrl = result.secure_url
            imageId = result.public_id
        }
        const product = new Product({
            name,
            discription,
            category,
            price,
            image: {
                imageUrl,
                imageId
            }
        })
        const updateProduct = await product.save()
        if (updateProduct) {
            res.status(200).send({ success: true, message: "product added successfully" })
        } else {
            res.status(401).send({ success: false, message: "product upload failed" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

const deleteProduct = async (req, res) => {
    try {
        let productId = req.query.id
        const findProduct = await Product.findOne({ _id: productId })
        let imageId = findProduct?.image?.imageId
        if (imageId) {
            const result = await cloudinary.uploader.destroy(imageId)
        }
        const deleteProduct = await Product.findOneAndDelete({ _id: productId })
        if (deleteProduct) {
            res.status(200).send({ success: true, message: "product deleted successfully" })
        } else {
            res.status(401).send({ success: false, message: "failed to delete product" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

const updateProduct = async(req,res)=>{
    try {
        const {id, category, discription, name, price}=req.body
        const findProduct = await Product.findOne({_id:id})
        let imageUrl = ''
        let imageId = ''
        if(req.file){
            const deleteResult = await cloudinary.uploader.destroy(findProduct.image.imageId)
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "productImg" })
            imageUrl = result.secure_url
            imageId = result.public_id
        }else{
            imageUrl=findProduct?.image?.imageUrl
            imageId=findProduct?.image?.imageId
        }
        findProduct.name=name
        findProduct.price=price
        findProduct.category=category
        findProduct.discription=discription
        findProduct.image.imageUrl=imageUrl
        findProduct.image.imageId=imageId
        const updatePro=await findProduct.save()
        if(updatePro){
            res.status(200).send({success:true,message:"product updated successfully"})
        }else{
            res.status(401).send({success:false,message:"product update failed!"})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })  
    }
}




module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    
    
}