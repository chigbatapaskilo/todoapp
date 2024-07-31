const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
fullName:{
    type:String,
    require:true,
    trim:true

},
email:{
    type:String,
    lowerCase:true,
    require:true,
    trim:true
},
password:{
    type:String,
    require:true
},
isAdmin:{
    type:Boolean,
    default:false
},isVerified:{
    type:Boolean,
    default:false,
    
}
,todo:[{
type:mongoose.SchemaTypes.ObjectId,
ref:"todo"
}]
})

const userModel=mongoose.model("todoapp",userSchema)
module.exports=userModel