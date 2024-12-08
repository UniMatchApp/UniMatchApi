import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve(__dirname, 'message.env');
dotenv.config({ path: envFilePath });

const connectToDatabase = async () => {
    const mongoUri = process.env.MESSAGE_DB_HOST || 'mongodb://localhost:27017/mydatabase'; // Usando directamente el URI de conexión

    try {
        await mongoose.connect(mongoUri);
        console.log('Data Source has been initialized for Message');
    } catch (error) {
        console.error('Error connecting to the database', error);
        throw error;
    }
};

export default connectToDatabase;
