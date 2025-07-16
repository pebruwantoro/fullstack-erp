import { SalesOrder } from '../models/salesOrder.js';
import { SalesOrder as SalesOrderModel } from '../../database.js';

const _mapToEntity = (SalesOrderModelInstance) => {
    if (!SalesOrderModelInstance) {
        return null;
    }
    
    const { id, quotationId, customerId, quantity, status, totalAmount, created_at, updated_at, deleted_at, createdBy, updatedBy, deletedBy } = SalesOrderModelInstance;
    return new SalesOrder(id, quotationId, customerId, quantity, status, totalAmount, created_at, updated_at, deleted_at, createdBy, updatedBy, deletedBy);
};

export default class SalesOrderRepository {
    async create(SalesOrderEntity) {
        const { quotationId, customerId, quantity, status, totalAmount, createdBy } = SalesOrderEntity;

        const newSalesOrder = await SalesOrderModel.create({
            quotationId,
            customerId,
            quantity,
            status,
            totalAmount,
            createdBy,
        });

        return _mapToEntity(newSalesOrder);
    }

    async update(id, updates, updatedBy) {
        const salesOrder = await SalesOrderModel.findByPk(id);

        if (!salesOrder) {
            return null;
        }

        const updatedData = {
            ...updates,
            updatedBy: updatedBy,
        };

        await salesOrder.update(updatedData);

        return _mapToEntity(salesOrder);
    }

    async findByQuotationId(quotationId){
        const salesOrders = await SalesOrderModel.findAll({ where: { 
            quotation_id: quotationId,
            deleted_at: null,
        } })
        return salesOrders.map(_mapToEntity);
    }

    async findByCustomerId(customerId){
        const salesOrders = await SalesOrderModel.findAll({ where: { 
            customer_id: customerId,
            deleted_at: null,
        } })
        return salesOrders.map(_mapToEntity);
    }

    async findById(id){
        const salesOrder = await SalesOrderModel.findOne({ where: { 
            id: id,
            deleted_at: null,
        } })
        return _mapToEntity(salesOrder);
    }
}