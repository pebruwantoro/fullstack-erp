import { Sequelize } from 'sequelize';
import dotenv from 'dotenv/config';
import UserModel from './application/models/user.js';
import CustomerModel from './application/models/customer.js';
import ProductModel from './application/models/product.js';
import QuotationModel from './application/models/quotation.js';
import QuotationItemModel from './application/models/quotationItem.js';
import SalesOrderModel from './application/models/salesOrder.js';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false
    }
);

const User = UserModel(sequelize, Sequelize);
const Customer = CustomerModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const Quotation = QuotationModel(sequelize, Sequelize);
const QuotationItem = QuotationItemModel(sequelize, Sequelize);
const SalesOrder = SalesOrderModel(sequelize, Sequelize);

Customer.belongsTo(User, {
    foreignKey: 'userId',
    as: 'users'
})

Customer.hasMany(Quotation, {
    foreignKey: 'customerId',
    as: 'quotations'
});

Customer.hasMany(SalesOrder, {
    foreignKey: 'customerId',
    as: 'sales_orders'
});

Quotation.hasMany(QuotationItem, {
    foreignKey: 'quotationId',
    as: 'quotation_items'
});

Product.hasMany(QuotationItem, {
    foreignKey: 'productId',
    as: 'product_items'
});

SalesOrder.belongsTo(Quotation, {
    foreignKey: 'quotationId',
    as: 'quotations'
})

sequelize.sync({ alter: true })


export { sequelize, User, Customer, Product, Quotation, QuotationItem, SalesOrder }