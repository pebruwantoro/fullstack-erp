import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import { fileURLToPath } from 'url';


import UserRepository from './application/repositories/userRepository.js';
import CustomerRepository from './application/repositories/customerRepository.js';
import ProductRepository from './application/repositories/productRepository.js';
import QuotationRepository from './application/repositories/quotationRepository.js';
import QuotationItemRepository from './application/repositories/quotationItemRepository.js';
import SalesOrderRepository from './application/repositories/salesOrderRepository.js';

import UserUsecase from './application/usecases/userUsecase.js';
import ProductUsecase from './application/usecases/productUsecase.js';
import QuotationUsecase from './application/usecases/quotationUsecase.js';

import UserController from './application/controllers/userController.js';
import ProductController from './application/controllers/productController.js';
import QuotationController from './application/controllers/quotationController.js';

import userRoute from './application/routes/userRoute.js';
import productRoute from './application/routes/productRoute.js';
import quotationRoute from './application/routes/quotationRoute.js';

import redisClient from './application/redis/redis.js';

const app = express();
app.use(cors());
app.use(express.json());

// REPOSITORIES
const userRepository = new UserRepository();
const customerRepository = new CustomerRepository();
const productRepository = new ProductRepository();
const quotationRepository = new QuotationRepository();
const quotationItemRepository = new QuotationItemRepository();
const salesOrderRepository = new SalesOrderRepository();

// USE-CASES
const userUsecase = new UserUsecase(userRepository, customerRepository);
const productUsecase = new ProductUsecase(productRepository, redisClient);
const quotationUsecase = new QuotationUsecase(quotationRepository, quotationItemRepository, productRepository);

// CONTROLLERS
const userController = new UserController(userUsecase);
const productController = new ProductController(productUsecase);
const quotationController = new QuotationController(quotationUsecase);

// ROUTES
const userRouter = userRoute(userController);
const productRouter = productRoute(productController);
const quotationRouter = quotationRoute(quotationController);

app.use('/v1/api/users', userRouter)
app.use('/v1/api/products', productRouter)
app.use('/v1/api/quotations', quotationRouter)

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
