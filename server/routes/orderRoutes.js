import express from 'express'
import { createOrder, getMyOrders, getAllOrders, getOrdersById, updateOrder } from '../controllers/orderController.js'
import { authMiddleware, authorizeMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, createOrder)
router.get('/my-orders', authMiddleware, getMyOrders)
router.get('/:orderId', authMiddleware, getOrdersById)

// admin
router.get('/', authMiddleware, authorizeMiddleware('admin'), getAllOrders)
router.put('/:orderId', authMiddleware, authorizeMiddleware('admin'), updateOrder)

export default router