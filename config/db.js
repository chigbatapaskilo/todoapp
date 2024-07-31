const mongoose=require("mongoose");
require("dotenv").config();
const Url=process.env.DATABASE_URL

mongoose.connect(Url)
.then(()=>{
console.log(`connection to database established`);
})
.catch((error)=>{
console.log("unable to connect to database because"+error.message)
});