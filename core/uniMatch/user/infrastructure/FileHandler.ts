import fs from 'fs';
import path from 'path';
import { IFileHandler } from '@/core/shared/application/IFileHandler';

export class FileHandler implements IFileHandler {
    private readonly allowedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    async save(fileName: string, data: File): Promise<string> {
        if (!this.isValidFileType(data.type)) {
            throw new Error('Invalid file type. Allowed types: ' + this.allowedFileTypes.join(', '));
        }

        const filePath = path.join(__dirname, 'uploads', fileName);

        return new Promise(async (resolve, reject) => {
            const writeStream = fs.createWriteStream(filePath);
            writeStream.on('error', (err) => reject(err));
            writeStream.write(Buffer.from(await data.arrayBuffer()));
            writeStream.end(() => resolve(filePath));
        });
    }

    async read(filePath: string): Promise<File> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                const file = new File([data], path.basename(filePath));
                resolve(file);
            });
        });
    }

    async delete(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    private isValidFileType(fileType: string): boolean {
        return this.allowedFileTypes.includes(fileType);
    }
}
