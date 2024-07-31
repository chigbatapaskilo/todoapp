const express=require('express');
const { createUser, loginUser,makeAdmin,   getAll, verifyEmail, resendVerifacation, forgetPassword, resetPassword, changePassword, deleteUser, getOneUser } = require('../controller/usercontroller');
const {authenticate }= require('../middleware/authorization');



const router=express.Router();
router.post("/signup",createUser)
router.post("/login",loginUser)

router.put("/makeadmin/:id",makeAdmin)
router.get("/onestudent",authenticate,getOneUser)
router.get("/allstudent",authenticate,getAll)
router.get("/verifyuser/:token",verifyEmail)
router.post("/reverify",resendVerifacation)
router.post("/forget-password",forgetPassword)
router.post("/reset-password/:token",resetPassword)
router.post("/change-password/:token",changePassword)
router.delete("/delete",deleteUser)
module.exports=router