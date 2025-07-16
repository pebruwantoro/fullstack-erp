import { describe, jest } from '@jest/globals';
import ProductUsecase from './productUsecase.js';
import ProductRepository from '../repositories/productRepository.js'
import { ErrorConstant } from '../constant/error.js';
import { sequelize } from '../../database.js';
import { Product } from '../models/product.js';


jest.mock('../repositories/productRepository.js');
jest.mock('../redis/redis.js');

describe('ProductUsecase', () => {
    let mockProductRepository;
    let mockRedisClient;
    let productUsecase;

    beforeEach(() => {
        mockProductRepository = new ProductRepository();
        const MockedRedisModule = require('../redis/redis.js');
        mockRedisClient = MockedRedisModule.default;
        productUsecase = new ProductUsecase(mockProductRepository, mockRedisClient);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('getProductById', () => {
        it('success get data', async() => {
            const productId = "product-id";

            mockProductRepository.findById.mockResolvedValue(new Product(productId, 'product 1', 'product 1', 'product 1', 12000, 100, new Date(), new Date(), null))

            const getProduct = await productUsecase.getProductById({ id: productId })
            
            expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
            expect(getProduct.id).toBe(productId);
            expect(getProduct.name).toBe('product 1');
            expect(getProduct.description).toBe('product 1');
            expect(getProduct.sku).toBe('product 1');
            expect(getProduct.price).toBe(12000);
            expect(getProduct.stock).toBe(100);
        })

        it('error product not found', async () => {
            const productId = "product-id";

            mockProductRepository.findById.mockResolvedValue(null);

            mockProductRepository.findById.mockResolvedValue(null);

            await expect(productUsecase.getProductById({ id: productId })).rejects.toThrow(
                ErrorConstant.ErrorProductNotFound
            );
        });
    })

    describe('getListProduct', () => {
        const cacheKey = 'products:all';
        const mockProductsFromDB = [
            new Product('prod-a', 'Product A', 'desc A', 'skuA', 100, 10, null, null, null),
            new Product('prod-b', 'Product B', 'desc B', 'skuB', 200, 20, null, null, null)
        ];
        const mockProductsCached = JSON.stringify(mockProductsFromDB);

        it('success get list product from cache', async () => {
            mockRedisClient.get.mockResolvedValue(mockProductsCached);

            const result = await productUsecase.getListProduct();

            expect(mockRedisClient.get).toHaveBeenCalledTimes(1);
            expect(mockRedisClient.get).toHaveBeenCalledWith(cacheKey);
            expect(mockProductRepository.findAll).not.toHaveBeenCalled();
            expect(mockRedisClient.set).not.toHaveBeenCalled();
            expect(result).toEqual(mockProductsFromDB);
        })

        it('success get list product from db', async () => {
            mockRedisClient.get.mockResolvedValue(null);
            mockProductRepository.findAll.mockResolvedValue(mockProductsCached);
            mockRedisClient.set.mockResolvedValue('OK');

            const result = await productUsecase.getListProduct();
            
            expect(mockRedisClient.get).toHaveBeenCalledWith(cacheKey);
            expect(mockProductRepository.findAll).toHaveBeenCalled();
            expect(mockRedisClient.set).toHaveBeenCalled();
            expect(result.length).not.toBe(0)
        })
    })
});