const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const Product = require('../model/productModel')
const Category = require('../model/categoryModel')

const Cart = require('../model/cartModel')
const mongoose = require('mongoose')

const userLogin = async (req, res) => {
    try {
        const { mobile } = req.body
        const userData = await User.findOne({ mobile: mobile })
        if (userData) {
            const token = jwt.sign({ id: userData._id, role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
            const data = token
            res.status(200).send({ success: true, message: "login successfull", data })
        } else {
            const newUser = new User({
                mobile
            })
            const saveUserData = await newUser.save()
            const token = jwt.sign({ id: saveUserData._id, role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
            const data = token
            res.status(201).send({ success: true, message: "account created successfully", data })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

const getProducts = async (req, res) => {
    try {
        const sort = req.query.sort ?? 'default'
        const search = req.query.name ?? '.*'
        const category = req.query.categoryId ?? ''

        const sortOption = {}
        if (sort === 'lowToHigh') sortOption.price = 1
        else if (sort === 'highToLow') sortOption.price = -1

        const query = { isBlocked: false, }
        if (search) query.name = { $regex: search, $options: 'i' }
        if (category) query.category = category

        const products = await Product.find(query).sort(sortOption)
        res.status(200).send({ success: true, message: "Products fetched successfully", data: products })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "Error fetching products" })
    }
}

const updateCart = async (req, res) => {
    try {
        const userId = req.id
        const { productId } = req.body
        let quantity = req.body.quantity ?? 1
        let cart = await Cart.findOne({ userId });
        let message = "Product added successfully"
        if (!cart) {
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        } else {
            const productExists = cart.products.find(product => product.productId.equals(productId));
            if (productExists) {
                productExists.quantity += Number(quantity);
                if (productExists.quantity <= 0) {
                    cart.products = cart.products.filter(product => !product.productId.equals(productId));
                }
            } else {
                cart.products.push({ productId, quantity });
            }
        }
        const status = await cart.save();
        res.status(200).send({ success: true, message })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "Error adding products" })
    }
}

const showCartData = async (req, res) => {
    const userId = req.id
    try {
        // const cartItems1 = await Cart.findOne({ userId })
        //     .populate('products.productId', 'name category image description price')
        //     .select('products')
        //     .lean();

        const cartItems = await Cart.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $project: {
                    'productDetails._id': 1,
                    'productDetails.name': 1,
                    'productDetails.category': 1,
                    'productDetails.image': 1,
                    'productDetails.description': 1,
                    'productDetails.price': 1,
                },
            },
        ])
       

        res.status(200).send({ success: true, message: "Cart items fetched successfully", data: cartItems })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "Error getting cart data" })
    }
}

const saveUserName = async(req,res)=>{
    try {
        let userId =req.id
        let newName= req.body.name
        const userData = await  User.findOneAndUpdate({_id:userId},{ $set: { name: newName } })
        if(userData){
          return  res.status(200).send({success:true ,message:"username saved sucessfully"})
        }else{
          return  res.status(401).send({success:false ,message:"failed to add username"})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" }) 
    }
}


const findAllCategory = async(req,res)=>{
    try {
        const categoryData = await Category.find({isBlocked:false})
        if(!categoryData){
         return  res.status(401).send({success:false ,message:"failed to fetch category"})
        }else{
            res.status(200).send({success:true ,message:"category fetched successfully",data:categoryData})  
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })  
    }
}


const checkIfUser = async (req, res) => {
    try {
        const tokenWithBearer = req.headers['authorization'];
        const token = tokenWithBearer.split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET_KEY, async (err, encoded) => {
            if (err) {
                return res.status(401).send({ message: "Auth failed", success: false });
            }
            if (encoded.role === 'user') {
                if(encoded.exp &&Date.now() >= encoded.exp*1000){
                    return res.status(401).send({success:false,message:"token expired"})
                }else{
                  return res.status(200).send({ message: "Auth successful", success: true });
                }      
            }else{
                res.status(401).send({ message: "unknown token", success: false }); 
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: "Something went wrong", success: false });
    }
};

module.exports = {
    userLogin,
    getProducts,
    updateCart,
    showCartData,
    saveUserName,
    findAllCategory,
    checkIfUser
}
