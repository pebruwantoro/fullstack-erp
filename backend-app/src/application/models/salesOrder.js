import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const SalesOrder = sequelize.define('sales_orders', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        quotationId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'quotation_id',
            unique: true,
            references: {
                model: 'quotations',
                key: 'id'
            }
        },
        customerId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'customer_id',
            references: {
                model: 'customers',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'total_amount',
        },
    }, {
        timestamps: true, 
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return SalesOrder;
}


export class SalesOrder {
    constructor(id = null, quotationId, customerId, status, totalAmount, createdAt = null, updatedAt = null, deletedAt = null) {
        this.id = id;
        this.quotationId = quotationId;
        this.customerId = customerId;
        this.status = status;
        this.totalAmount = totalAmount;

        // Nullable Audit Fields
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}

export const SalesOrderStatus = {
    INVOICED: 'invoiced',
    SHIPPED: 'shipped',
    COMPLETED: 'completed',
    CANCELED: 'canceled'
};