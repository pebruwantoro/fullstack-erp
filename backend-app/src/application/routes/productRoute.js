import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

export default (productController) => {
    const router = Router();

    router.get('/:id', authMiddleware, (req, res) => productController.getProductDetail(req, res))
    router.get('/', authMiddleware, (req, res) => productController.getListProduct(req, res))
    
    return router
}