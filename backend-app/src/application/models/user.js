import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(UserRole)),
            allowNull: false,
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

    return User;
}


export class User {
    constructor(id = null, name, email, password, role, createdAt = null, updatedAt = null, deletedAt = null, createdBy = null, updatedBy = null, deletedBy = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;

        // Nullable Audit Fields
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
    }
}

export const UserRole = {
    CUSTOMER: 'customer',
    SALES: 'sales',
};