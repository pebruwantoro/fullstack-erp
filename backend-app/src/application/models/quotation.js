import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Quotation = sequelize.define('quotations', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'total_amount',
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'created_by'
        },
        updatedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'updated_by'
        },
        deletedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'deleted_by'
        },
    }, {
        timestamps: true, 
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return Quotation;
}


export class Quotation {
    constructor(id = null, customerId, status, totalAmount, createdAt = null, updatedAt = null, deletedAt = null, createdBy = null, updatedBy = null, deletedBy = null) {
        this.id = id;
        this.customerId = customerId;
        this.status = status;
        this.totalAmount = totalAmount;

        // Nullable Audit Fields
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
    }
}

export const QuotationStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};