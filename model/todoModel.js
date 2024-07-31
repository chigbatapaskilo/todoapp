const mongoose=require("mongoose");

const todoSchema=new mongoose.Schema({
tittle:{
    type:String,
    require:true,
    trim:true

},
content:{
    type:String,
    require:true,
    
}
,user:{
type:mongoose.SchemaTypes.ObjectId,
ref:"todoapp"
}
},{timestamps:true})

const todoModel=mongoose.model("todo",todoSchema)
module.exports=todoModel