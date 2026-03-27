import express from 'express'
import {register,login,logout,} from '../controllers/authController.js'
import {authMiddleware} from '../middleware.js'

const router=express.Router()


router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/me',authMiddleware,currentUser)
router.put('/update-profile', authMiddleware, updateProfile)
router.put('/update-password', authMiddleware, resetPassword)

export default router