import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const QuotationItem = sequelize.define('quotation_items', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        quotationId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'quotation_id',
            references: {
                model: 'quotations',
                key: 'id'
            }
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'product_id',
            references: {
                model: 'products',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unitPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'unit_price',
        },
        subTotal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'sub_total',
        },
    }, {
        timestamps: true, 
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return QuotationItem;
}


export class QuotationItem {
    constructor(id = null, quotationId, productId, quantity, unitPrice, subTotal, createdAt = null, updatedAt = null, deletedAt = null) {
        this.id = id;
        this.quotationId = quotationId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subTotal = subTotal;

        // Nullable Audit Fields
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}