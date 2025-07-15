import { Router } from 'express';

export default (userController) => {
    const router = Router();

    router.post('/register', (req, res) => userController.createUser(req, res))

    return router
}