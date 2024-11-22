import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { NotificationEntity } from './models/NotificationEntity';

const envFilePath = path.resolve(__dirname, 'notifications.env');
dotenv.config({ path: envFilePath });

const AppDataSource = new DataSource({
    type: 'mongodb',
    url: process.env.NOTIFICATION_DB_HOST || 'localhost',
    port: parseInt(process.env.NOTIFICATION_DB_PORT || '27017', 10),
    database: process.env.NOTIFICATION_DB_NAME || 'mydatabase',
    synchronize: false,
    entities: [NotificationEntity],
    logging: process.env.NOTIFICATION_DB_LOGGING === 'true',
    useUnifiedTopology: process.env.NOTIFICATION_DB_USE_UNIFIED_TOPOLOGY === 'true',
});

export default AppDataSource;
