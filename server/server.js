import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
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




//routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/product',productRoutes)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/review', reviewRoutes)



app.listen(process.env.PORT,()=>{
    console.log("server is listening ON PORT 8000")
})