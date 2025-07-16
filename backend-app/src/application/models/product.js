import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Product = sequelize.define('products', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: true, 
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return Product;
}


export class Product {
    constructor(id = null, name, description, sku, price, stock, createdAt = null, updatedAt = null, deletedAt = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sku = sku;
        this.price = price;
        this.stock = stock;

        // Nullable Audit Fields
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}