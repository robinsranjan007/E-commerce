import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getAllProductById, updateProduct } from '../controllers/productController.js'
import { authMiddleware, authorizeMiddleware } from '../middleware/authMiddleware.js'



const router= express.Router()



router.get('/',getAllProducts)
router.get('/:productId',getAllProductById)


//admin
router.post('/',authMiddleware,authorizeMiddleware('admin'),createProduct)
router.put('/:productId',authMiddleware,authorizeMiddleware('admin'),updateProduct)
router.delete('/:productId',authMiddleware,authorizeMiddleware('admin'),deleteProduct)



export default router