import fs from 'fs';
import path from 'path';

import { IFileHandler } from '@/core/shared/application/IFileHandler';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

export class FileHandler implements IFileHandler {

    private readonly server_url: string;
    private readonly server_port: string;

    constructor(server_url: string, server_port: string) {
        this.server_url = server_url;
        this.server_port = server_port;
    }

    private readonly allowedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];


    async save(fileName: string, data: File): Promise<string> {
        const extname = path.extname(fileName) || (data.type ? `.${data.type.split('/')[1]}` : '.txt');
        
        const filePath = path.join(__dirname, 'uploads', fileName + extname);
    
        return new Promise(async (resolve, reject) => {
            const serverUrl = `${this.server_url}:${this.server_port}/uploads/${fileName}${extname}`;
            console.log('FileHandler.save', serverUrl);
            const writeStream = fs.createWriteStream(filePath);
    
            writeStream.on('finish', () => resolve(serverUrl));
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
        const uploadsDir = path.join(__dirname, 'uploads');
        console.log('Uploads dir', uploadsDir);

        const url = new URL(filePath);
        const fileName = path.basename(url.pathname);

        // Construir la ruta completa en el sistema
        const systemPath = path.join(uploadsDir, fileName);
        console.log("SystemPath", systemPath);


        return new Promise((resolve, reject) => {
            fs.unlink(systemPath, (err) => {
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


