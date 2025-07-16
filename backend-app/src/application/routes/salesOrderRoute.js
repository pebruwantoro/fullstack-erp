import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

export default (salesOrderController) => {
    const router = Router();

    router.post('/', (req, res) => salesOrderController.createSalesOrder(req, res))
    router.get('/', (req, res) => salesOrderController.getSalesOrders(req, res))
    
    return router
}