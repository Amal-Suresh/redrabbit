const Admin = require('../model/adminModel')
const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

const adminLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body
        const adminData = await Admin.findOne({ mobile: mobile })
        if (adminData) {
            if (adminData.password == password) {
                const token = jwt.sign({ id: adminData._id, role: "admin" }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
                const data = token
                res.status(200).send({ success: true, message: "login successfull", data })
            }else{
            res.status(201).send({ success: false, message: "invalid password" })
            }
        } else {
            res.status(201).send({ success: false, message: "invalid mobile number" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

const checkIfAdmin = async (req, res) => {
    try {
        const tokenWithBearer = req.headers['authorization'];
        const token = tokenWithBearer.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, encoded) => {
            if (err) {
                return res.status(401).send({ message: "Auth failed", success: false });
            }
            if (encoded.role === 'admin') {
                if (encoded.exp && Date.now() >= encoded.exp * 1000) {
                    return res.status(401).send({ success: false, message: "token expired" })
                } else {
                    return res.status(200).send({ message: "Auth successful", success: true });
                }
            } else {
                res.status(401).send({ message: "unknown token", success: false });
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: "Something went wrong", success: false });
    }
};


const getUserList = async (req, res) => {
    try {
        const userList = await User.find()
        if (userList) {
            res.status(200).send({ success: true, message: "fetched user details", data: userList })
        } else {
            res.status(401).send({ success: false, message: "unable to fetch user details" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}
const blockUnblockUser = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.query.id })
        userData.status = !userData.status
        const saveUserData = await userData.save()
        if (saveUserData) {
            res.status(200).send({ success: true, message: "user status changed successfully" })
        } else {
            res.status(201).send({ success: false, message: "failled to change user status" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })

    }
}


module.exports = {
    adminLogin,
    checkIfAdmin,
    getUserList,
    blockUnblockUser
}
