import { QuotationItem } from '../models/quotationItem.js';
import { QuotationItem as QuotationItemModel } from '../../database.js';
import { Op } from 'sequelize'; 

const _mapToEntity = (QuotationItemModelInstance) => {
    if (!QuotationItemModelInstance) {
        return null;
    }
    
    const { id, quotationId, productId, quantity, unitPrice, subTotal, created_at, updated_at, deleted_at } = QuotationItemModelInstance;
    return {
        id,
        quotation_id: quotationId,
        total_amount: productId,
        quantity,
        unit_price: unitPrice,
        sub_total: subTotal,
        created_at,
        updated_at,
        deleted_at,
    }
};

export default class QuotationItemRepository {
    async create(quotationItemEntity) {
        const { quotationId, productId, quantity, unitPrice, subTotal, createdBy } = quotationItemEntity;

        const newQuotationItem = await QuotationItemModel.create({
            quotationId,
            productId,
            quantity,
            unitPrice,
            subTotal,
            createdBy,
        });

        return _mapToEntity(newQuotationItem);
    }

    async createMany(quotationItemEntities, transaction = null) {
        if (!Array.isArray(quotationItemEntities) || quotationItemEntities.length === 0) {
            console.warn("Attempted to create many quotation items with an empty or invalid entities array.");
            return [];
        }
        
        const itemsToCreate = quotationItemEntities.map(entity => ({
            quotationId: entity.quotationId,
            productId: entity.productId,
            quantity: entity.quantity,
            unitPrice: entity.unitPrice,
            subTotal: entity.subTotal,
            createdBy: entity.createdBy,
        }));

        const newQuotationItems = await QuotationItemModel.bulkCreate(itemsToCreate, {
            transaction: transaction,
        });

        return newQuotationItems.map(_mapToEntity);
    }

    async update(id, updates, updatedBy) {
        const quotationItem = await QuotationItemModel.findByPk(id);
        if (!quotationItem) {
            return null;
        }

        const updatedData = {
            ...updates,
            updatedBy: updatedBy,
        };

        await quotationItem.update(updatedData);

        return _mapToEntity(quotationItem);
    }

    async findByQuotationId(quotationId){
        const quotationItems = await QuotationItemModel.findAll({ where: { 
            quotation_id: quotationId,
            deleted_at: null,
        } })
        return quotationItems.map(_mapToEntity);
    }

     async findByQuotationIds(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            return [];
        }
        
        const quotationItems = await QuotationItemModel.findAll({
            where: {
                quotation_id: {
                    [Op.in]: ids,
                },
                deleted_at: null,
            }
        });

        return quotationItems.map(_mapToEntity);
    }
}