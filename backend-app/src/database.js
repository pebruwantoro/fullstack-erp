import { Sequelize } from 'sequelize';
import dotenv from 'dotenv/config';
import UserModel from './application/models/user.js';

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

sequelize.sync({ alter: true })


export { sequelize, User }