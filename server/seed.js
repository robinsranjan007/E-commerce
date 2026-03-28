import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/Users.js'

dotenv.config()

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin already exists')
      process.exit()
    }

    const hashedPassword = await bcrypt.hash('admin123', 10)

    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    })

    console.log('Admin created successfully!')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

seedAdmin()