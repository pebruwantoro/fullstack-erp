import { Router } from 'express';
import { authMiddleware, customerMiddleware } from '../middleware/authMiddleware.js';

export default (quotationController) => {
    const router = Router();

    router.post('/', authMiddleware, customerMiddleware, (req, res) => quotationController.createQuotation(req, res))
    
    return router
}