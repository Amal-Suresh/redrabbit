const jwt = require('jsonwebtoken')
const User =require('../model/userModel');
const { removeAllListeners } = require('../routes/user');

  
const adminAuth = async (req, res, next) => {
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
                    console.log("adminAuth");
                    console.log(encoded);
                    next()
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



const userAuth = async (req, res, next) => {
    try {
        const tokenWithBearer = req.headers['authorization'];
        const token = tokenWithBearer.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, encoded) => {
            if (err) {
                return res.status(401).send({ message: "Auth failed", success: false });
            }
            if (encoded.role === 'user') {
                if (encoded.exp && Date.now() >= encoded.exp * 1000) {
                    return res.status(401).send({ success: false, message: "token expired" })
                } else {     
                    req.id = encoded.id
                    const checkUser = async(id)=>{
                        const userData =await User.findOne({_id:id})
                        if(userData?.status){
                            next()
                        }else{
                            res.status(202).send({success:false,message:"you were bolcked by admin"})  
                        }
                    }
                    checkUser(req.id) 
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


module.exports = {
    adminAuth,
    userAuth
}