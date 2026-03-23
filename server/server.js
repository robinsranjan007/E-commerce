import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoDB from './config/db.js'
dotenv.config()



const app=express()



//middleware
app.use(express.json())
 
app.use(cookieParser())
mongoDB()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}))








app.listen(process.env.PORT,()=>{
    console.log("server is listening ON PORT 8000")
})