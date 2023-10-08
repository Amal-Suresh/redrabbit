const mongoose = require('mongoose')

const categorySchema =mongoose.Schema({
    name:{
        type:String,
        required:true  
    },
    image:{
        public_id:{
            type:String
        },
        image:{
            type:String
        }
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    
})
module.exports = mongoose.model("category",categorySchema)