const mongoose = require('mongoose')

const riderSchema =mongoose.Schema({
    name:{
        type:String,
        required:true  
    },
    image:{
        imageUrl:{type:String},
        imageId:{type:String},
    },
    mobile:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    licenseNumber:{
        type:String,
        required:true
    },
    bloodGroup:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:true
    }
})
module.exports = mongoose.model("rider",riderSchema)