import { Sequelize } from 'sequelize';
import { dbConfig } from './config.js';
import UserModel from './application/models/user.js';

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging
    }
);

const User = UserModel(sequelize, Sequelize);

sequelize.sync({ alter: true })


export { sequelize, User }