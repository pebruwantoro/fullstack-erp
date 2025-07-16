import { describe, jest, it, expect, beforeEach } from '@jest/globals';
import SalesOrderUsecase from './salesOrderUsecase.js';
import SalesOrderRepository from '../repositories/salesOrderRepository.js';
import QuotationRepository from '../repositories/quotationRepository.js';
import { Quotation, QuotationStatus } from '../models/quotation.js';
import { SalesOrder, SalesOrderStatus } from '../models/salesOrder.js';

jest.mock('../repositories/salesOrderRepository.js');
jest.mock('../repositories/quotationRepository.js');

describe('SalesOrderUsecase', () => {
    let mockSalesOrderRepository;
    let mockQuotationRepository;
    let salesOrderUsecase;

    beforeEach(() => {
        mockSalesOrderRepository = new SalesOrderRepository();
        mockQuotationRepository = new QuotationRepository();
        salesOrderUsecase = new SalesOrderUsecase(mockSalesOrderRepository, mockQuotationRepository);
    });

    describe('createSalesOrder', () => {
        const mockApprovedQuotations = [
            new Quotation('q-id-1', 'cust-1', QuotationStatus.APPROVED, 150000),
            new Quotation('q-id-2', 'cust-2', QuotationStatus.APPROVED, 250000)
        ];

        const mockCreatedSalesOrders = [
            new SalesOrder('so-id-1', 'q-id-1', 'cust-1', SalesOrderStatus.INVOICED, 150000),
            new SalesOrder('so-id-2', 'q-id-2', 'cust-2', SalesOrderStatus.INVOICED, 250000)
        ];

        it('should create sales orders for all approved quotations and update their status', async () => {
            mockQuotationRepository.findAll.mockResolvedValue(mockApprovedQuotations);
            mockSalesOrderRepository.createMany.mockResolvedValue(mockCreatedSalesOrders);
            mockQuotationRepository.updateMany.mockResolvedValue(); // updateMany doesn't need a specific return value for this test

            const result = await salesOrderUsecase.createSalesOrder();

            expect(mockQuotationRepository.findAll).toHaveBeenCalledWith({ status: QuotationStatus.APPROVED });

            expect(mockSalesOrderRepository.createMany).toHaveBeenCalled();
            expect(mockSalesOrderRepository.createMany.mock.calls[0][0]).toHaveLength(2);
            expect(mockSalesOrderRepository.createMany.mock.calls[0][0][0]).toBeInstanceOf(SalesOrder);
            expect(mockSalesOrderRepository.createMany.mock.calls[0][0][0].quotationId).toBe('q-id-1');

            const updatedQuotations = mockApprovedQuotations.map(q => {
                q.status = 'processed';
                return q;
            });
            expect(mockQuotationRepository.updateMany).toHaveBeenCalledWith(['q-id-1', 'q-id-2'], updatedQuotations);

            expect(result).toEqual(mockCreatedSalesOrders);
        });

        it('should do nothing if no approved quotations are found', async () => {
            mockQuotationRepository.findAll.mockResolvedValue([]);

            const result = await salesOrderUsecase.createSalesOrder();

            expect(result).toBeUndefined();
        });

        it('should handle a null response from the repository', async () => {
            mockQuotationRepository.findAll.mockResolvedValue(null);

            const result = await salesOrderUsecase.createSalesOrder();
 
            expect(mockSalesOrderRepository.createMany).not.toHaveBeenCalled();
            expect(mockQuotationRepository.updateMany).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
        });
    });
});