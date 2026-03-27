import express from 'express'
import { createReview, getReviewsByProduct, getMyReviews, deleteReview } from '../controllers/reviewController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/:productId', authMiddleware, createReview)
router.get('/my-reviews', authMiddleware, getMyReviews)
router.get('/:productId', getReviewsByProduct)
router.delete('/:reviewId', authMiddleware, deleteReview)

export default router