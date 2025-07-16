import { Router } from 'express';
import { authMiddleware, customerMiddleware, salesMiddleware } from '../middleware/authMiddleware.js';

export default (quotationController) => {
    const router = Router();

    router.post('/', authMiddleware, customerMiddleware, (req, res) => quotationController.createQuotation(req, res))
    router.put('/:id/approve', authMiddleware, salesMiddleware, (req, res) => quotationController.approveQuotation(req, res))

    return router
}