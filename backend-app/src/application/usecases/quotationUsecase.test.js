import { describe, jest } from '@jest/globals';
import QuotationUsecase from './quotationUsecase.js';
import QuotationRepository from '../repositories/quotationRepository.js'
import QuotationItemRepository from '../repositories/quotationItemRepository.js'
import ProductRepository from '../repositories/productRepository.js'
import SalesOrderRepository from '../repositories/salesOrderRepository.js'
import { ErrorConstant } from '../constant/error.js';
import { sequelize } from '../../database.js';
import { Product } from '../models/product.js';
import { Quotation, QuotationStatus } from '../models/quotation.js';
import { QuotationItem } from '../models/quotationItem.js';

jest.mock('../repositories/quotationRepository.js');
jest.mock('../repositories/quotationItemRepository.js');
jest.mock('../repositories/productRepository.js');
jest.mock('../repositories/salesOrderRepository.js');

describe('ProductUsecase', () => {
    let mockQuotationRepository;
    let mockQuotationItemRepository;
    let mockProductRepository;
    let mockSalesOrderRepository;
    let quotationUsecase;

    beforeEach(() => {
        mockQuotationRepository = new QuotationRepository();
        mockQuotationItemRepository = new QuotationItemRepository();
        mockProductRepository = new ProductRepository();
        mockSalesOrderRepository = new SalesOrderRepository();
        quotationUsecase = new QuotationUsecase(mockQuotationRepository, mockQuotationItemRepository, mockProductRepository, mockSalesOrderRepository);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('createQuotation', () => {
        const quotationRequest = {
            products: [
                {
                    id: "product-id-1",
                    price: 10000,
                    quantity: 2,
                },
                {
                    id: "product-id-2",
                    price: 20000,
                    quantity: 2,
                },
            ],
            createdBy: "user1"
        };

        const requestEmpty = {
            products: [],
            createdBy: "user1"
        };

        const productDB = [
            new Product("product-id-1", 'Product A', 'desc A', 'skuA', 10000, 10, null, null, null),
            new Product("product-id-2", 'Product B', 'desc B', 'skuB', 20000, 20, null, null, null)
        ];

        it('success create data', async () => {
            mockProductRepository.findByIds.mockResolvedValue(productDB);
            
            const quotation = new Quotation('id', 'user1', QuotationStatus.PENDING, 60000, null, null, null, 'user1');
            
            mockQuotationRepository.create.mockResolvedValue(quotation);
            
            const quotationItems = [
                new QuotationItem('id', 'id', "product-id-1", 2, 10000,(2*10000)),
                new QuotationItem('id', 'id', "product-id-2", 2, 20000,(2*20000))
            ];

            mockQuotationItemRepository.createMany.mockResolvedValue(quotationItems);

            const updatedProducts = [
                new Product("product-id-1", 'Product A', 'desc A', 'skuA', 10000, 8, null, null, null),
                new Product("product-id-2", 'Product B', 'desc B', 'skuB', 20000, 18, null, null, null)
            ];

            mockProductRepository.updateMany.mockResolvedValue(['product-id-1', 'product-id-2'], updatedProducts);

            const newQuotation = await quotationUsecase.createQuotation(quotationRequest);

            expect(newQuotation).not.toBe(NaN);
            expect(newQuotation).not.toBe(undefined);
        })

        it('error request empty', async () => {
            await expect(quotationUsecase.createQuotation(requestEmpty)).rejects.toThrow(
                ErrorConstant.ErrorProductNull
            );
        })
    })
});