import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IFileHandler } from '@/core/shared/application/IFileHandler';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo shared.env
dotenv.config({ path: 'shared.env' });

export class S3FileHandler implements IFileHandler {
    private readonly s3: S3Client;
    private readonly bucketName: string;

    constructor() {
        // Configurar el AWS SDK con las credenciales y la región
        this.s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
            },
            region: process.env.AWS_REGION ?? 'us-east-1',
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME ?? 'default-bucket';
    }

    async save(fileName: string, data: File): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: Buffer.from(await data.arrayBuffer()),
            ContentType: data.type,
        };

        const command = new PutObjectCommand(params);
        await this.s3.send(command);

        return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
    }

    async read(filePath: string): Promise<File> {
        const params = {
            Bucket: this.bucketName,
            Key: filePath,
        };

        const command = new GetObjectCommand(params);
        const { Body } = await this.s3.send(command);

        const chunks: Uint8Array[] = [];
        for await (const chunk of Body as AsyncIterable<Uint8Array>) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        return new File([buffer], filePath);
    }

    async delete(filePath: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: filePath,
        };

        const command = new DeleteObjectCommand(params);
        await this.s3.send(command);
    }
}