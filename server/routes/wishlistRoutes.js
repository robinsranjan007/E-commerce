import express from 'express'
import { addToWishlist, getWishlist, removefromWishlist } from '../controllers/wishlistController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getWishlist)
router.post('/', authMiddleware, addToWishlist)
router.delete('/', authMiddleware, removefromWishlist)

export default router