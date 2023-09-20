// const mongoose = require('mongoose')

// const categorySchema =mongoose.Schema({
//     name:{
//         type:String,
//         required:true  
//     },
//     image:{
//         type:String,
//         required:true
//     },
//     isBlocked:{
//         type:Boolean,
//         default:true
//     }
// })
// module.exports = mongoose.model("category",categorySchema)

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