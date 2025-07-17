import { Quotation } from '../models/quotation.js';
import { Quotation as QuotationModel } from '../../database.js';
import { Op } from 'sequelize'; 

const _mapToEntity = (QuotationModelInstance) => {
    if (!QuotationModelInstance) {
        return null;
    }
    
    const { id, customerId, status, totalAmount, created_at, updated_at, deleted_at, createdBy, updatedBy, deletedBy } = QuotationModelInstance;
    return {
        id,
        customer_id: customerId,
        status,
        total_amount: totalAmount,
        created_at,
        updated_at,
        deleted_at,
        created_by: createdBy,
        updated_by: updatedBy,
        deleted_by: deletedBy,
    }
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

    async findAll(filter){
        let whereClause = {
            deleted_at: null,
        };
        let orderClause = ['created_at', 'DESC'];

        if (filter.status){
            whereClause = {
                status: filter.status,
                deleted_at: null,
            }
            orderClause = ['status', 'DESC'];
        } else if (filter.createdAt) {
            const filterDate = new Date(filter.createdAt);
            const startOfDay = new Date(filterDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filterDate);
            endOfDay.setDate(endOfDay.getDate() + 1);
            endOfDay.setHours(0, 0, 0, 0);

            whereClause.created_at = {
                [Op.gte]: startOfDay,
                [Op.lt]: endOfDay
            }
            orderClause = ['created_at', 'DESC'];
        }

        let filterQuery = {
            where: whereClause,
            order: [orderClause]
        };

        if (filter.limit && filter.page) {
            filterQuery.limit = filter.limit;
            filterQuery.offset = (filter.page - 1) * filter.limit;
        }

        const quotations = await QuotationModel.findAll(filterQuery);

        return quotations.map(_mapToEntity);
    }

    async count(filter){
        let whereClause = {
            deleted_at: null,
        };
        let orderClause = ['created_at', 'DESC'];

        if (filter.status){
            whereClause = {
                status: filter.status,
                deleted_at: null,
            }
            orderClause = ['status', 'DESC'];
        } else if (filter.createdAt) {
            const filterDate = new Date(filter.createdAt);
            const startOfDay = new Date(filterDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filterDate);
            endOfDay.setDate(endOfDay.getDate() + 1);
            endOfDay.setHours(0, 0, 0, 0);

            whereClause.created_at = {
                [Op.gte]: startOfDay,
                [Op.lt]: endOfDay
            }
            orderClause = ['created_at', 'DESC'];
        }

        const totalCount = await QuotationModel.count({ 
            where: whereClause,
            order: [orderClause],
        });

        return totalCount;
    }

    async updateMany(ids, updates) {
        if (!Array.isArray(ids) || ids.length === 0) {
            return { count: 0 };
        }

        const updatePayload = updates.map(item => ({
            id: item.id,
            status: item.status,
            updated_at: new Date(),
        }));

        for (const updated of updatePayload) {
            await QuotationModel.update(
                {
                    status: updated.status
                },
                {
                    where: {
                        id: updated.id
                    }
                }
            )
        }

        return updates.map(_mapToEntity);
    }
}