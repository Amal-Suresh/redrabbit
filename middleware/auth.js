const jwt = require('jsonwebtoken')





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


module.exports = {
  
    userAuth
}