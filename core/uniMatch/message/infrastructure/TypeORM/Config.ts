import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { MessageEntity } from './models/MessageEntity';

const envFilePath = path.resolve(__dirname, 'message.env');
dotenv.config({ path: envFilePath });

const AppDataSource = new DataSource({
    type: 'mongodb',
    url: process.env.MESSAGE_DB_HOST || 'localhost',
    port: parseInt(process.env.MESSAGE_DB_PORT || '27017', 10),
    database: process.env.MESSAGE_DB_NAME || 'mydatabase',
    synchronize: false,
    entities: [MessageEntity],
    logging: process.env.MESSAGE_DB_LOGGING === 'true',
    useUnifiedTopology: process.env.MESSAGE_DB_USE_UNIFIED_TOPOLOGY === 'true',
});


export default AppDataSource;
