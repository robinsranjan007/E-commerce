import express from 'express'
import { getCart, addToCart, updateCartItem, removeCart, clearCart } from '../controllers/cartController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getCart)
router.post('/', authMiddleware, addToCart)
router.put('/', authMiddleware, updateCartItem)
router.delete('/clear', authMiddleware, clearCart)
router.delete('/', authMiddleware, removeCart)

export default router