import express from 'express'
import { createCheckoutSession, webhook } from '../controllers/paymentController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/create-checkout-session', authMiddleware, createCheckoutSession)

// webhook pe authMiddleware nahi lagega — Stripe directly call karta hai
// aur raw body chahiye — express.json() se pehle aana chahiye
router.post('/webhook', express.raw({ type: 'application/json' }), webhook)

export default router