import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve(__dirname, 'message.env');
dotenv.config({ path: envFilePath });

const AppDataSource = new DataSource({
    type: 'mongodb',
    url: process.env.MESSAGE_DB_HOST || 'localhost',
    port: parseInt(process.env.MESSAGE_DB_PORT || '27017', 10),
    database: process.env.MESSAGE_DB_NAME || 'mydatabase',
    synchronize: process.env.MESSAGE_DB_SYNCHRONIZE === 'true',
    logging: process.env.MESSAGE_DB_LOGGING === 'true',
    useUnifiedTopology: process.env.MESSAGE_DB_USE_UNIFIED_TOPOLOGY === 'true',
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized for Messages');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization for Messages', err);
    });

export default AppDataSource;
