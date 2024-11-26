import fs from 'fs';
import path from 'path';
import { IFileHandler } from '@/core/shared/application/IFileHandler';

export class FileHandler implements IFileHandler {

    private readonly server_url: string;
    private readonly server_port: string;

    constructor(server_url: string, server_port: string) {
        this.server_url = server_url;
        this.server_port = server_port;
    }

    private readonly allowedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    async save(fileName: string, data: File): Promise<string> {

        const filePath = path.join(__dirname, 'uploads', fileName);

        return new Promise(async (resolve, reject) => {
            const serverUrl = `${this.server_url}:${this.server_port}/uploads/${fileName}`;
            const writeStream = fs.createWriteStream(filePath);
            writeStream.on('error', (err) => reject(err));
            writeStream.write(Buffer.from(await data.arrayBuffer()));
            writeStream.end(() => resolve(serverUrl));
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
