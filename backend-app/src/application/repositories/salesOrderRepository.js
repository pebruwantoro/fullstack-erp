import { SalesOrder } from '../models/salesOrder.js';
import { SalesOrder as SalesOrderModel } from '../../database.js';

const _mapToEntity = (SalesOrderModelInstance) => {
    if (!SalesOrderModelInstance) {
        return null;
    }
    
    const { id, quotationId, customerId, status, totalAmount, created_at, updated_at, deleted_at } = SalesOrderModelInstance;
    return {
        id, 
        quotation_id: quotationId,
        customer_id: customerId,
        status, 
        total_amount: totalAmount, 
        created_at, 
        updated_at, 
        deleted_at
    };
};

export default class SalesOrderRepository {
    async createMany(salesOrder, transaction = null) {
        if (!Array.isArray(salesOrder) || salesOrder.length === 0) {
            return [];
        }
        
        const itemsToCreate = salesOrder.map(entity => ({
            quotationId: entity.quotationId,
            customerId: entity.customerId,
            status: entity.status,
            totalAmount: entity.totalAmount,
        }));

        const newData = await SalesOrderModel.bulkCreate(itemsToCreate, {
            transaction: transaction,
        });

        return newData.map(_mapToEntity);
    }

    async findAll(filter){
        let whereClause = {
            deleted_at: null,
        };
        let orderClause = ['created_at', 'DESC'];

        if(filter.quotationId){
            whereClause.quotation_id = filter.quotationId;
        }

        let filterQuery = {
            where: whereClause,
            order: [orderClause]
        };

        if (filter.limit && filter.page) {
            filterQuery.limit = filter.limit;
            filterQuery.offset = (filter.page - 1) * filter.limit;
        }

        const quotationItems = await SalesOrderModel.findAll(filterQuery)
        return quotationItems.map(_mapToEntity);
    }

    async count(filter){
        let whereClause = {
            deleted_at: null,
        };
        let orderClause = ['created_at', 'DESC'];

        if(filter.quotationId){
            whereClause.quotation_id = filter.quotationId;
        }

        let filterQuery = {
            where: whereClause,
            order: [orderClause]
        };

        const totalCount = await SalesOrderModel.count(filterQuery);

        return totalCount;
    }
}