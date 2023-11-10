const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    is_admin:{
        type:Number,
        required:true
    },
    address:{
         type:String,
         required:false
    },
    about:{
        type:String,
        required:false
    },
    profession:{
        type:String,
        required:false
    },
    is_verified:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model('user',userSchema);