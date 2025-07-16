import { Quotation } from '../models/quotation.js';
import { Quotation as QuotationModel } from '../../database.js';

const _mapToEntity = (QuotationModelInstance) => {
    if (!QuotationModelInstance) {
        return null;
    }
    
    const { id, customerId, status, totalAmount, created_at, updated_at, deleted_at, createdBy, updatedBy, deletedBy } = QuotationModelInstance;
    return new Quotation(id, customerId, status, totalAmount, created_at, updated_at, deleted_at, createdBy, updatedBy, deletedBy);
};

export default class QuotationRepository {
    async create(quotationEntity) {
        const { customerId, status, totalAmount, createdBy } = quotationEntity;

        const newQuotation = await QuotationModel.create({
            customerId,
            status,
            totalAmount,
            createdBy,
        });
        
        return _mapToEntity(newQuotation);
    }

    async update(id, updates, updatedBy) {
        const quotation = await QuotationModel.findByPk(id);

        if (!quotation) {
            return null;
        }

        const updatedData = {
            ...updates,
            updatedBy: updatedBy,
        };

        await quotation.update(updatedData);

        return _mapToEntity(quotation);
    }

    async findByCustomerId(customerId){
        const quotations = await QuotationModel.findAll({ where: { 
            customer_id: customerId,
            deleted_at: null,
        } })
        return quotations.map(_mapToEntity);
    }

    async findById(id){
        const quotation = await QuotationModel.findOne({ where: { 
            id: id,
            deleted_at: null,
        } })
        return _mapToEntity(quotation);
    }
}