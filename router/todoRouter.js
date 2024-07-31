const todorouter=require('express').Router();
const {createTask, getAllTask, getOne, deleteTask, updateTask}=require('../controller/todocontroller');
const { authenticate } = require('../middleware/authorization');
todorouter.post('/create-task',authenticate,createTask)
todorouter.get('/create-task',authenticate,getAllTask)
todorouter.get('/create-task/:todoId',authenticate,getOne)
todorouter.put('/create-task/:todoId',authenticate,updateTask)
todorouter.delete('/create-task/:todoId',authenticate,deleteTask)
module.exports=todorouter