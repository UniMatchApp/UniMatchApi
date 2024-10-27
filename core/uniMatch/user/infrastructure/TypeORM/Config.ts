import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve(__dirname, 'user.env');
dotenv.config({ path: envFilePath });

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.USER_DB_HOST || 'localhost',
    port: parseInt(process.env.USER_DB_PORT || '3306', 10),
    username: process.env.USER_DB_USERNAME || 'test',
    password: process.env.USER_DB_PASSWORD || 'test',
    database: process.env.USER_DB_NAME || 'test',
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized for User');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization for User', err);
    });

export default AppDataSource;
