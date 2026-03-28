import express from 'express'
import { createCoupon, getAllCoupons, updateCoupon, deleteCoupons, validateCoupon } from '../controllers/couponController.js'
import { authMiddleware, authorizeMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// customer
router.post('/validate', authMiddleware, validateCoupon)

// admin
router.get('/', authMiddleware, authorizeMiddleware('admin'), getAllCoupons)
router.post('/', authMiddleware, authorizeMiddleware('admin'), createCoupon)
router.put('/:coupanId', authMiddleware, authorizeMiddleware('admin'), updateCoupon)
router.delete('/:coupanId', authMiddleware, authorizeMiddleware('admin'), deleteCoupons)

export default router