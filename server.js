const express=require("express")
const router = require("./router/userRouter")
const todorouter=require("./router/todorouter")


require("./config/db")



const app=express()
app.use(express.json())
app.use("/api/v1/user",router)
app.use("/api/v1/user",todorouter)
const PORT=process.env.PORT||2024
app.listen(PORT,()=>{
    console.log(`app is running on port:${PORT}`)
})
app.get("/",(req,res)=>{
res.status(200).json({message:"welcome"})
})