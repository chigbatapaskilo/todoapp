const todorouter=require('express').Router();
const {createTask, getAllTask, getOne, deleteTask, updateTask}=require('../controller/todocontroller');
const { authenticate } = require('../middleware/authorization');
todorouter.post('/create-task',authenticate,createTask)
todorouter.get('/getall-task',authenticate,getAllTask)
todorouter.get('/one-task/:todoId',authenticate,getOne)
todorouter.put('/update-task/:todoId',authenticate,updateTask)
todorouter.delete('/delete-task/:todoId',authenticate,deleteTask)
module.exports=todorouter