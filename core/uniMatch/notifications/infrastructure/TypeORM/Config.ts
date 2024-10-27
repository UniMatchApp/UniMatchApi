import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({ path: 'notifications.env' });

const AppDataSource = new DataSource({
    type: 'mongodb',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '27017', 10),
    database: process.env.DB_NAME || 'mydatabase',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    useUnifiedTopology: process.env.DB_USE_UNIFIED_TOPOLOGY === 'true',
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

export default AppDataSource;
