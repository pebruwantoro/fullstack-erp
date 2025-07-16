import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

export default (salesOrderController) => {
    const router = Router();

    router.post('/', (req, res) => salesOrderController.createSalesOrder(req, res))
    
    return router
}