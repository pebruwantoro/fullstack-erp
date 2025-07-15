import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

export default (userController) => {
    const router = Router();

    router.post('/register', (req, res) => userController.createUser(req, res))
    router.post('/login', (req, res) => userController.loginUser(req, res))
    router.get('/my-profile', authMiddleware, (req, res) => userController.getUserProfile(req, res))

    return router
}