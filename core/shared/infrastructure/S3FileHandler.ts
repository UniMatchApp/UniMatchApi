import { S3 } from 'aws-sdk';
import { IFileHandler } from '@/core/shared/application/IFileHandler';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export class S3FileHandler implements IFileHandler {
    private s3: S3;
    private bucketName: string;

    constructor() {
        // Configurar el AWS SDK con las credenciales y la región
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'default-bucket';
    }

    async save(fileName: string, data: File): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: Buffer.from(await data.arrayBuffer()),
            ContentType: data.type,
        };

        await this.s3.upload(params).promise();
        return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
    }

    async read(filePath: string): Promise<File> {
        const params = {
            Bucket: this.bucketName,
            Key: filePath,
        };

        const data = await this.s3.getObject(params).promise();
        return new File([data.Body as Buffer], filePath);
    }

    async delete(filePath: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: filePath,
        };

        await this.s3.deleteObject(params).promise();
    }
}