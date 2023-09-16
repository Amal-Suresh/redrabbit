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
            res.status(401).send({ success: false, message: "invalid mobile number"})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}



module.exports = {
    adminLogin,
}
