import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { EventEntity } from './models/EventEntity';

const envFilePath = path.resolve(__dirname, 'event.env');
dotenv.config({ path: envFilePath });

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.EVENT_DB_HOST || 'localhost',
    port: parseInt(process.env.EVENT_DB_PORT || '3306', 10),
    username: process.env.EVENT_DB_USERNAME || 'test',
    password: process.env.EVENT_DB_PASSWORD || 'test',
    database: process.env.EVENT_DB_NAME || 'test',
    entities: [EventEntity],
    synchronize: false
});



export default AppDataSource;
