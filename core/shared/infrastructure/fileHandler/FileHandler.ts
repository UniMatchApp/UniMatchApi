import fs from 'fs';
import path from 'path';
import { IFileHandler } from '@/core/shared/application/IFileHandler';
import { promisify } from 'util';
import { fileTypeFromBuffer } from 'file-type';

const writeFile = promisify(fs.writeFile);

export class FileHandler implements IFileHandler {

    private readonly server_url: string;
    private readonly server_port: string;
    private readonly allowedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    constructor(server_url: string, server_port: string) {
        this.server_url = server_url;
        this.server_port = server_port;
    }

    private isValidFileType(fileType: string): boolean {
        return this.allowedFileTypes.includes(fileType);
    }

    async save(fileName: string, data: File): Promise<string> {
            /* if (!this.isValidFileType(data.type)) {
            console.log(`File type: ${data.type}`);
            throw new Error("Invalid file type.");
        } */

        const buffer = Buffer.from(await data.arrayBuffer());

        // Detectar el tipo MIME real del archivo
        const fileType = await fileTypeFromBuffer(buffer);
        if (!fileType || !this.isValidFileType(fileType.mime)) {
            throw new Error("Invalid file type detected from content.");
        }

        /* if (data.type !== fileType.mime) {
            throw new Error("Declared file type does not match actual file type.");
        } */

        const extname = path.extname(fileName) || `.${fileType.ext}`;
        const filePath = path.join(__dirname, 'uploads', fileName + extname);

        return new Promise(async (resolve, reject) => {
            const serverUrl = `${this.server_url}:${this.server_port}/uploads/${fileName}${extname}`;
            const writeStream = fs.createWriteStream(filePath);

            writeStream.on('finish', () => resolve(serverUrl));
            writeStream.on('error', (err) => reject(err));

            writeStream.write(buffer);
            writeStream.end();
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
        const uploadsDir = path.join(__dirname, 'uploads');

        const url = new URL(filePath);
        const fileName = path.basename(url.pathname);

        const systemPath = path.join(uploadsDir, fileName);

        return new Promise((resolve, reject) => {
            fs.unlink(systemPath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}