import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

const envFilePath = path.resolve(__dirname, 'notifications.env');
dotenv.config({ path: envFilePath });

const connectToDatabase = async () => {
    const mongoUri = process.env.NOTIFICATION_DB_HOST || 'mongodb://localhost:27017/mydatabase'; // Usando directamente el URI de conexión

    try {
        const connection = await mongoose.createConnection(mongoUri).asPromise(); // `createConnection` devuelve un objeto de conexión
        console.log('Data Source has been initialized for Notification');
        return connection; // Retorna la conexión para usarla en otras partes de la app
    } catch (error) {
        console.error('Error connecting to the database', error);
        throw error;
    }
};

export default connectToDatabase;
