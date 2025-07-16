import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Customer = sequelize.define('customers', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'users',
                key: 'id'
            }
        },
    },{
        timestamps: true, 
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return Customer;
}


export class Customer {
    constructor(id = null, userId, createdAt = null, updatedAt = null, deletedAt = null) {
        this.id = id;
        this.userId = userId;

         // Nullable Audit Fields
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}