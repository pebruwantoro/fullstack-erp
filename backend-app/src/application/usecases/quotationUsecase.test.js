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

describe('ProductUsecase', () => {
    let mockQuotationRepository;
    let mockQuotationItemRepository;
    let mockProductRepository;
    let quotationUsecase;

    beforeEach(() => {
        mockQuotationRepository = new QuotationRepository();
        mockQuotationItemRepository = new QuotationItemRepository();
        mockProductRepository = new ProductRepository();
        quotationUsecase = new QuotationUsecase(mockQuotationRepository, mockQuotationItemRepository, mockProductRepository);
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

    describe('approveQuotation', () => {
        const quotationId = 'id1';
        const salesId = 'id2'
        const quotationNotApprove = new Quotation('id1', 'user1', QuotationStatus.PENDING, 60000, null, null, null, 'user1');
        const quotationAlreadyApproved = new Quotation('id1', 'user1', QuotationStatus.APPROVED, 60000, null, null, null, 'user1');
    
        it('success approve quotation', async () => {
            mockQuotationRepository.findById.mockResolvedValue(quotationNotApprove);

            mockQuotationRepository.update.mockResolvedValue(quotationNotApprove);
        
            const updatedQuotation = await quotationUsecase.approveQuotation({id: quotationId, updateBy: salesId})
            
            expect(mockQuotationRepository.findById).toHaveBeenCalledWith(quotationId);
            expect(mockQuotationRepository.update).toHaveBeenCalled();
            expect(updatedQuotation).toBeInstanceOf(Quotation);
            expect(quotationNotApprove).toBe(updatedQuotation);
        })

        it('error data not found', async () => {
            mockQuotationRepository.findById.mockResolvedValue(null);

            await expect(quotationUsecase.approveQuotation({id: quotationId, updateBy: salesId})).rejects.toThrow(
                ErrorConstant.ErrorQuotationNotFound
            );
        })

        it('error quotation already approved', async () => {
            mockQuotationRepository.findById.mockResolvedValue(quotationAlreadyApproved);

            await expect(quotationUsecase.approveQuotation({id: quotationId, updateBy: salesId})).rejects.toThrow(
                ErrorConstant.ErrorQuotationAlreadyApproved
            );
        })
    })

    describe('getListQuotations', () => {
        const filterRequest = {
            status: QuotationStatus.PENDING,
            createdAt: '2025-10-10',
            page: 1,
            limit: 10,
        };

        const quotations = [
            new Quotation('id1', 'id', QuotationStatus.PENDING, 40000),
            new Quotation('id2', 'id', QuotationStatus.PENDING, 40000)
        ];
        
        const quotationItems = [
            new QuotationItem('id', 'id1', 'id', 2, 10000, 20000),
            new QuotationItem('id', 'id1', 'id', 2, 10000, 20000),
            new QuotationItem('id', 'id2', 'id', 2, 10000, 20000),
            new QuotationItem('id', 'id2', 'id', 2, 10000, 20000)
        ];
        const total = 2;

        it('success get data', async () => {
            mockQuotationRepository.count.mockResolvedValue(total);
            mockQuotationRepository.findAll.mockResolvedValue(quotations);
            mockQuotationItemRepository.findByQuotationIds.mockResolvedValue(quotationItems);

            const result = await quotationUsecase.getListQuotations(filterRequest);

            expect(mockQuotationRepository.count).toHaveBeenCalledWith(filterRequest);
            expect(mockQuotationRepository.findAll).toHaveBeenCalledWith(filterRequest);
            expect(mockQuotationItemRepository.findByQuotationIds).toHaveBeenCalledWith(['id1', 'id2']);
            expect(result.list.length).toBe(quotations.length);
            expect(result.pagination.page).toBe(filterRequest.page);
            expect(result.pagination.per_page).toBe(filterRequest.limit);
            expect(result.pagination.total_page).toBe(Math.ceil(total/filterRequest.limit));
            expect(result.pagination.total_data).toBe(total);
        })
    })
});