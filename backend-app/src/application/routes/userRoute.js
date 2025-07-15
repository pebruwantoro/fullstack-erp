import { Router } from 'express';

export default (userController) => {
    const router = Router();

    router.post('/register', (req, res) => userController.createUser(req, res))
    router.post('/login', (req, res) => userController.loginUser(req, res))

    return router
}