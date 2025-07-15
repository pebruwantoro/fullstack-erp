import dotenv from 'dotenv';
dotenv.config();
import { appConfig } from './config.js';
import express from 'express';
import cors from 'cors';


import UserRepository from './application/repositories/userRepository.js';
import UserUsecase from './application/usecases/userUsecase.js';
import UserController from './application/controllers/userControler.js';
import userRoute from './application/routes/userRoute.js';

const app = express();
app.use(cors());
app.use(express.json());

// REPOSITORIES
const userRepository = new UserRepository();

// USE-CASES
const userUsecase = new UserUsecase(userRepository);

// CONTROLLERS
const userController = new UserController(userUsecase);

// ROUTES
const userRouter = userRoute(userController);

app.use('/v1/api/users', userRouter)

const PORT = appConfig.port;
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT: ${PORT}`);
});
