import { ErrorConstant } from '../constant/error.js';
import { QuotationStatus } from '../models/quotation.js';
import { SalesOrder, SalesOrderStatus } from '../models/salesOrder.js';


export default class SalesOrderUsecase {
    constructor(salesOrderRepository, quotationRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.quotationRepository = quotationRepository;
    }

    async createSalesOrder() {
        const filter = {
            status: QuotationStatus.APPROVED,
        }
        
        const getQuotations = await this.quotationRepository.findAll(filter);
        if (!getQuotations) {
            return;
        }

        let salesOrders = [];
        let quotationIds = [];
        getQuotations.forEach(quotation => {
            const order = new SalesOrder(null, quotation.id, quotation.customer_id, SalesOrderStatus.INVOICED, quotation.total_amount, null, null, null);
            salesOrders.push(order);
            quotation.status = QuotationStatus.PROCESSED;
            quotationIds.push(quotation.id);
        });

        const newSalesOrder = await this.salesOrderRepository.createMany(salesOrders);
        
        await this.quotationRepository.updateMany(quotationIds, getQuotations)
        
        return newSalesOrder;
    }

    async getSalesOrders(filter) {
        const total = await this.salesOrderRepository.count(filter);
       
        const list = await this.salesOrderRepository.findAll(filter);
        
        return {
            list: list,
            pagination: {
                page: filter.page,
                per_page: filter.limit,
                total_page: Math.ceil(total/filter.limit),
                total_data: total,
            },
        }
    }
}