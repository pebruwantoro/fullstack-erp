import { Product } from '../models/product.js';
import { Product as ProductModel } from '../../database.js';
import { Op } from 'sequelize'; 

const _mapToEntity = (ProductModelInstance) => {
    if (!ProductModelInstance) {
        return null;
    }
    
    const { id, name, description, sku, price, stock, created_at, updated_at, deleted_at, } = ProductModelInstance;
    return {
        id,
        name,
        description,
        sku,
        price,
        stock,
        created_at,
        updated_at,
        deleted_at,
    };
};

export default class ProductRepository {

    async updateMany(ids, updates) {
        if (!Array.isArray(ids) || ids.length === 0) {
            return { count: 0 };
        }

        const updatePayload = updates.map(item => ({
            id: item.id,
            stock: item.stock,
            updated_at: new Date(),
        }));

        for (const updated of updatePayload) {
            await ProductModel.update(
                {
                    stock: updated.stock
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
    async findAll() {
        const products = await ProductModel.findAll();
        return products.map(_mapToEntity);
    }

    async findById(id) {
        const product = await ProductModel.findOne({ where: { 
            id: id,
            deleted_at: null,
        }});
        return _mapToEntity(product);
    }

    async findByIds(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            return [];
        }
        
        const products = await ProductModel.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
                deleted_at: null,
            }
        });

        return products.map(_mapToEntity);
    }
}