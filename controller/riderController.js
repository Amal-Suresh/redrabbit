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


const deleteRider = async (req, res) => {
    try {
        let riderId = req.query.id
        const findRider = await Rider.findOne({ _id: riderId })
        let imageId = findRider?.image?.imageId
        if (imageId) {
            const result = await cloudinary.uploader.destroy(imageId)
        }
        const deleteRider = await Rider.findOneAndDelete({ _id: riderId })
        if (deleteRider) {
            res.status(200).send({ success: true, message: "rider account deleted successfully" })
        } else {
            res.status(401).send({ success: false, message: "failed to delete rider account" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

const updateRider = async (req, res) => {
    try {
        const { name, mobile, userName, password, licenseNumber, bloodGroup, id } = req.body
        const findRider = await Rider.findById(id)
        let imageUrl = ''
        let imageId = ''
        if (req.file) {
            const deleteResult = await cloudinary.uploader.destroy(findRider.image.imageId)
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "riderImg" })
            imageUrl = result.secure_url
            imageId = result.public_id
        } else {
            imageUrl = findRider?.image?.imageUrl
            imageId = findRider?.image?.imageId
        }
        findRider.name = name
        findRider.mobile=mobile
        findRider.bloodGroup=bloodGroup
        findRider.userName=userName
        findRider.password=password
        findRider.licenseNumber=licenseNumber
        const updateRider = await findRider.save()
        if (updateRider) {
            res.status(200).send({ success: true, message: "rider details updated successfully" })
        } else {
            res.status(401).send({ success: false, message: "rider details update failed!" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

const riderChangeStatus = async (req, res) => {
    try {
        const { id } = req.query
        const findRider = await Rider.findOne({ _id: id })
        findRider.isBlocked = !findRider.isBlocked
        const updateStatus = await findRider.save()
        if (updateStatus) {
            res.status(200).send({ success: true, message: "rider status changed successfully" })
        } else {
            res.status(200).send({ success: true, message: "rider status change failed" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}


const findAllRiders = async (req, res) => {
    try {
        const riders = await Rider.find()
        if (riders) {
            res.status(200).send({ success: true, message: "rider data fetched successfully", data:riders })
        } else {
            res.status(200).send({ success: true, message: "failed to find riders" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

const findRider=async(req,res)=>{
    try {
        const riderID =req.query.id
        const rider = await Rider.findOne({_id:riderID})
        if(!rider){
            return res.status(201).send({success:false,message:"rider details not found"})  
        }else{
             res.status(200).send({success:true,message:"rider details fetched successfully",data:rider})  
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({success:false,message:"something went wrong"})  

    }

}






module.exports = {
    createRider,
    deleteRider,
    updateRider,
    riderChangeStatus,
    findAllRiders,
    findRider
}
