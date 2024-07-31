const todoModel=require('../model/todoModel')
const userModel=require('../model/userModel')

exports.createTask=async(req,res)=>{
    try {
        const {userId}=req.user
        const {tittle,content}=req.body
        const user=await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message:'user not found'
            })
        }
        const Todo=new todoModel({
            tittle,
            content
        })

        Todo.user=userId
        user.todo.push(Todo._id)
        await Todo.save()
        await user.save()
        res.status(201).json({
            message:'todo content created successfully',
            data:Todo
        })

        
    } catch (error) {
      res.status(500).json({
        message:'server error',
        errorMessage:error.message
      })  
    }
}
exports.getOne=async(req,res)=>{
    try {
        const {todoId}=req.params
        const todo=await todoModel.findById(todoId)
        if(!todo){
            return res.status(404).json({
                message:'user not found'
            })
        }
     res.status(200).json({
        message:'get me the user',
        data:todo
     })

        
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            errorMessage:error.message
          })  
    }
}
exports.getAllTask=async(req,res)=>{
    try {
        const {userId}=req.user
        const contents=await todoModel.find({user:userId})
        res.status(200).json({
            message:'all contents found',
            data:contents
        })
    } catch (error) {
        res.status(500).json({
            message:'server error',
            errorMessage:error.message
          })  
    }
}
exports.updateTask=async(req,res)=>{
    try {
        const {userId}=req.user
        const {todoId}=req.params
        const {tittle,content}=req.body
        const user=await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                messasge:'user not found'
            })
        }
        const todo=await todoModel.findById(todoId)
        if(!todo){
            return res.status(404).json({
                message:'todo content not found'
            })
        }
        if(todo.user.toString() !== userId.toString()){
           return res.status(401).json({
            message:'unable to update another users content'
           })
        }
        const data={
            tittle:tittle||todo.tittle,
            content:content||todo.content
        }
        const updateContent=await todoModel.findByIdAndUpdate(todoId,data,{new:true})
        res.status(200).json({
            message:'update successfull',
            data:updateContent
        })
    } catch (error) {
        res.status(500).json({
            message:'server error',
            errorMessage:error.message
          })   
    }
}
exports.deleteTask=async(req,res)=>{
    try {
        const {todoId}=req.params
        const todo=await todoModel.findById(todoId)
        if(!todo){
         return res.status(404).json({
            message:'user not found'
         })
        }
        const deleteContent=await todoModel.findByIdAndDelete(todoId)
        res.status(200).json({
            message:'deteted successful'
        })
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            errorMessage:error.message
          }) 
    }
}