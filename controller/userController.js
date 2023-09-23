const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const Product = require('../model/productModel')
const Cart = require('../model/cartModel')

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
        const { userId, productId } = req.body
        let quantity = req.body.quantity ?? 1
        let cart = await Cart.findOne({ userId });
        let message = "Product added successfully"
        if (!cart) {
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        } else {
            const existingProduct = cart.products.find(product => product.productId.equals(productId));
            if (existingProduct) {
                existingProduct.quantity += Number(quantity);
                if (existingProduct.quantity <= 0) {
                    cart.products = cart.products.filter(product => !product.productId.equals(productId));
                }
            } else {
                cart.products.push({ productId, quantity });
            }
        }
        // } else {
        //     const existingProductIndex = cart.products.findIndex(product => product.productId.equals(productId));
        //     if (existingProductIndex !== -1) {
        //         cart.products[existingProductIndex].quantity += Number(quantity);
        //         // remove product if quantity less than or equal to zero
        //         if (cart.products[existingProductIndex].quantity <= 0) {
        //             cart.products.splice(existingProductIndex, 1)
        //             message = "Product removed successfully"
        //         }
        //     } else {
        //         cart.products.push({ productId, quantity });
        //     }
        // }
        const status = await cart.save();
        res.status(200).send({ success: true, message })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "Error adding products" })
    }
}

module.exports = {
    userLogin,
    getProducts,
    updateCart
}
