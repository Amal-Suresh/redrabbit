const User = require('../model/userModel')
const jwt = require('jsonwebtoken')

const userLogin = async (req, res) => {
    try {
        const { mobile } = req.body
        const userData = await User.findOne({ mobile:mobile })
        if (userData) {
                const token = jwt.sign({ id: userData._id, role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
                const data = token
                res.status(200).send({ success: true, message: "login successfull", data })
        } else {
            const newUser = new User({
                mobile
            })
            const saveUserData=await newUser.save()
            const token = jwt.sign({ id: saveUserData._id, role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
            const data=token
            res.status(201).send({ success: true, message: "account created successfully", data})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

module.exports = {
    userLogin,
}
