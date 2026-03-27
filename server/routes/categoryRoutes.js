import express from 'express'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/categoryController.js'
import { authMiddleware, authorizeMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()


router.get('/',getAllCategories)
router.post('/',authMiddleware,authorizeMiddleware('admin'),createCategory)
router.put('/:categoryId',authMiddleware,authorizeMiddleware('admin'),updateCategory)
router.delete('/:categoryId',authMiddleware,authorizeMiddleware('admin'),deleteCategory)

export default router