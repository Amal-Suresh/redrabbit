const Rider = require('../model/riderModel')
const cloudinary = require('../utils/cloudnery')


const createRider = async (req, res) => {
    try {
        const { name, mobile, userName, password, licenseNumber, bloodGroup } = req.body
        const riderExists = await Rider.findOne({ mobile: mobile })
        if (riderExists) {
            return res.status(201).send({ success: false, message: "rider already exists" })
        } else {
            let imageUrl = ''
            let imageId = ''
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, { folder: "riderImg" })
                imageUrl = result.secure_url
                imageId = result.public_id
            }
            const rider = new Rider({
                name,
                mobile,
                password,
                userName,
                image: {
                    imageUrl,
                    imageId
                },
                licenseNumber,
                bloodGroup
            })
            const newRider = await rider.save()
            if (newRider) {
                res.status(200).send({ success: true, message: "new rider added successfully" })
            } else {
                res.status(401).send({ success: false, message: "new rider creation failed" })
            }
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

module.exports = {
    createRider
}
