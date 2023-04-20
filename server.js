const express = require("express");
const dotenv =require("dotenv").config();
const dataConnection = require("./config/dataBase");
const userRoute=require("./router/userRouter")
const cors=require("cors")
// create server
const app = express()

app.use(cors())

// create middleware for comming data

app.use(express.json())

//  // connecting database
dataConnection()

//user middleware

app.use("/api",userRoute)
const PORT=process.env.PORT || 5002

app.listen(PORT,()=>{

    console.log(`server is connect ${PORT}`);

})