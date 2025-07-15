export const dbConfig = {
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5433',
  dialect: 'postgres',
  logging: false,
};

export const appConfig = {
  port: process.env.APP_PORT,
};