const mongoose =require("mongoose")


const userSchema=mongoose.Schema({
    name:{
        required:[true,"please enter your name"],
        type:String,  
    },
    password:{
        required:[true,"please enter your password"],
        type:String,  
    },
    email:{
        required:[true,"please enter your email"],
        type:String,  
    }
},{
    timestampe:true
})

const User=mongoose.model("user",userSchema)

module.exports=User