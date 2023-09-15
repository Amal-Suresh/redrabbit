const Admin = require('../model/adminModel')
const jwt = require('jsonwebtoken')

const adminLogin = async (req, res) => {
    try {
        const { mobile } = req.body
        const adminData = await Admin.findOne({ mobile:mobile })
        if (adminData) {
                const token = jwt.sign({ id: adminData._id, role: "admin" }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
                const data = token
                res.status(200).send({ success: true, message: "login successfull", data })
        } else {
            const newAdmin = new Admin({
                mobile
            })
            const saveAdminData=await newAdmin.save()
            const token = jwt.sign({ id: saveAdminData._id, role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
            const data=token
            res.status(201).send({ success: true, message: "account created successfully", data})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

module.exports = {
    adminLogin,
}
