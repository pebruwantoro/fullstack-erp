import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import { fileURLToPath } from 'url';


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

// SWAGGER DOCS API
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let swaggerDocument;
try {
    const swaggerFile = path.join(__dirname, 'docs', 'openapi.yml');
    const swaggerYml = fs.readFileSync(swaggerFile, 'utf-8');
    swaggerDocument = YAML.parse(swaggerYml);
} catch (error) {
    console.error('Error reading openapi.yml: ', error);
    process.exit(1);
}

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT: ${PORT}`);
});
