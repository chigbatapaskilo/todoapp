const userModel=require("../model/userModel")
const bcrypt=require("bcrypt")
const Jwt=require("jsonwebtoken")
const sendMail=require("../middleware/sendmail")
const {htmlFile,verifyTemplate,forgetPasswordtemplate}=require('../middleware/html')

const createUser=async(req,res)=>{
    try {
        const {fullName,email,password}=req.body
        if(!email||!fullName||!password){
            return res.status(400).json({
                message:'please enter all details'
            })
        }
        const existingUser=await userModel.findOne({email:email.toLowerCase()})
        if(existingUser){
            return res.status(400).json({
                message:"user with email already exist"
            })
            
        }else{
            const saltPassword=await bcrypt.genSalt(10)
            const hashPassword=await bcrypt.hash(password,saltPassword);
            const user=new userModel({
                fullName,
                email,
                 password:hashPassword
            })
            // get token to verify if a user signs up
            const token=Jwt.sign({
                userId:user._id,
                password:user.password
                 },process.env.JWT_SECRET
                 ,{expiresIn:"1h"})
                 
            const verifyLink= `${req.protocol}://${req.get("host")}/api/v1/verifyuser/${user._id}/${token}`
            let mailOptions={
                email:user.email,
                subject:'verification email',
                html:htmlFile(verifyLink,user.fullName)
            }
            console.log( user.email)
            await user.save()
     
            await sendMail(mailOptions);
           res.status(201).json({
                message:"new user created",
                data:user
            })
        
        }
        
    } catch (error) {
      res.status(500).json({
        message:error.message
      })  
    }
    
    
    }
    const loginUser=async(req,res)=>{
        try {
            const {email,password}=req.body
            const checkMail=await userModel.findOne({email})
            if(!checkMail){
                return res.status(400).json({
                    message:"user with email does not exist"
                })
            }else{
                const verifyPassword=await bcrypt.compare(password,checkMail.password)
                if(!verifyPassword){
             return  res.status(400).json({
                message:"incorrect password"
               })
            
                }else{
                    if(!checkMail.isVerified){
                return res.status(400).json({
                    message:'user not verified'
                })
                    }
                 const token=Jwt.sign({
                userId:checkMail._id,
                email:checkMail.email,
               
                 },process.env.JWT_SECRET
                 ,{expiresIn:"5h"})
                 res.status(200).json({
                    message:"login successful",
                    data:checkMail,
                    token
                 })
                }
    
            } 
        } catch (error) {
         res.status(500).json({
            message:error.message
         })   
        }
    }
  
    const makeAdmin=async(req,res)=>{
    try {
        const userId=req.params
        const user=await userModel.findById(userId)
        if(!user){
        return res.status(400).json({
            message:"user not found"
        })
        }
        user.isAdmin=true
        await user.save()
        res.status(200).json({
            message:"user now admin",
            data:user
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
    }
    
    const getAll=async(req,res)=>{
        try {
            const allStudent=await userModel.find()
            res.status(200).json({
                message:"the total of "+allStudent.length+" "+"registered",
                data:allStudent
            })
        } catch (error) {
            res.status(500).json({
                message:error.message
            })
        }
    }
    const getOneUser=async(req,res)=>{
        try {
            const {userId}=req.params
            const user=await userModel.findById(userId)
            if(!user){
                return res.status(404).json({
                    message:'user not found .'
                })
            }
            res.status(200).json({
                message:'get me this user',
                data:user
            })
        } catch (error) {
            res.status(500).json({
                message:error.message
            })  
        }
    }
    const verifyEmail=async(req,res)=>{
        try {
            //get the token from the params
            const {token}=req.params
            // verify the email
            const {userEmail}=Jwt.verify(token,process.env.JWT_SECRET)
            console.log(userEmail)
            // get the user from the with the email
            const user=await userModel.findOne({email:userEmail});
            // check if the user is in the database
            if(!user){
                return res.status(404).json({
                    message:'user not found'
                })
            }
    
            // check if the user is verified
            if(user.isVerified){
                return res.status(400).json({
                    message:'user already verified'
                })
            }
           // verify the user
             user.isVerified=true
             await user.save()
             res.status(200).json({
                message:'user verification successful'
             })
            
        } catch (error) {
            if(error instanceof jwt.JsonWebTokenError){
                return res.status(400).json({
                    message:'link expired.'
                })
            }
            res.status(500).json({
                message:error.message
            }) 
        }
    }
    const resendVerifacation=async(req,res)=>{
        try {
            const {email}=req.body
            // get the user from the email
            const user=await userModel.findOne({email});
            if(!user){
                return res.status(404).json({
                    message:'user does not exit'
                })
            }
            // check if the user is verified
            if(user.isVerified){
               return res.status(400).json({
                message:'user aleardy verified'
               })
            }
            // create a new token for the user
            const token=Jwt.sign({userId:user._id,userEmail:user.email},process.env.JWT_SECRET,{expiresIn:'20mins'})
            const verifyLink= `${req.protocol}://${req.get("host")}/api/v1/user/verifyuser/${token}`
            let mailOptions={
                email:user.email,
                subject:'verification email',
                html:verifyTemplate(verifyLink,user.fullName)
            }
    
            sendMail(mailOptions)
            res.status(200).json({
                message:'verification link sent to your email'
            })
     
    
        } catch (error) {
            res.status(500).json({
                message:error.message
            })
        }
    }
    const forgetPassword=async(req,res)=>{
        try {
            const {email}=req.body
            // find the user with the email passed in the reqbody
            const user=await userModel.findOne({email})
            // check if user with the email exist
            if(!user){
                return res.status(404).json('user with the '+user.email+'does not exit')
            }
            const token=Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'30m'})
            
            const verifyLink= `${req.protocol}://${req.get("host")}/api/v1/user/reset-password/${token}`
            let mailOptions={
                email:user.email,
                subject:'verification email',
                html:forgetPasswordtemplate(verifyLink,user.fullName)
            }
            await user.save()
           await sendMail(mailOptions)
           res.status(200).json('check your email for reset password link')
            
    
        } catch (error) {
          res.status(500).json(error.message)  
        }
    }
    const resetPassword=async(req,res)=>{
        try {
    
            // get the token from the params
            const {token}=req.params
            const {password}=req.body
        
           
            // confirm the new password
     
            const {email}=Jwt.verify(token,process.env.JWT_SECRET,)
            // find the user by the email
            const user=await userModel.findOne({email})
         
            // check for user is registered
            if(!user){
            return res.status(404).json('user not found')
            }
            const saltRound=await bcrypt.genSalt(18);
            const hashPassword=await bcrypt.hash(password,saltRound)
            user.password=hashPassword
           
            await user.save()
    
            res.status(200).json('password reset successfully')
    
        } catch (error) {
            if(error instanceof jwt.JsonWebTokenError){
                return res.status(400).json('link expired please request for a new link.')
            }
            res.status(500).json(error.message)
        }
    }
    const changePassword=async(req,res)=>{
        try {
            const {token}=req.params
            const {password,oldPassword}=req.body
          
            const {email}= Jwt.verify(token,process.env.JWT_SECRET)
            // check for user
            const user=await userModel.findOne({email})
            if(!user){
            return res.status(400).json('user not found')
            }
            const verifyPassword=await bcrypt.compare(oldPassword,user.password)
            if(!verifyPassword){
                return res.status(400).json('password deos not match existing password.')
    
            }
            const saltedRound=await bcrypt.genSalt(10)
            const hashedpassword=await bcrypt.hash(password,saltedRound)
            user.password=hashedpassword
            await user.save()
            res.status(200).json('password changed successfully')
        } catch (error) {
            if(error instanceof Jwt.JsonWebTokenError){
                return res.status(400).json('error because'+error.message)
            }
            res.status(500).json({errorMessage:error.message})
        }
    }
    const deleteUser=async(req,res)=>{
        try {
            const {userId}=req.params
            const user=await userModel.findById(userId)
            if(!user){
                return res.status(404).json({
                    message:'user not found'
                })
            }
            const deleteUser=await userModel.findByIdAndDelete(userId)
            res.status(200).json({
                message:'user deleted successful'
            })
        } catch (error) {
            res.status(500).json({
                errorMessage:error.message})
        }
    }
    
    
    module.exports={
        createUser
        ,loginUser,
         makeAdmin,
         getAll,
         getOneUser,
         verifyEmail,
         resendVerifacation,
         forgetPassword,
         resetPassword,
         changePassword,
        deleteUser
        }
  