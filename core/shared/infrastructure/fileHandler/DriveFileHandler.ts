import { IFileHandler } from '@/core/shared/application/IFileHandler';
import { google, drive_v3 } from 'googleapis';
import * as path from 'path';
import { GoogleAuth } from 'google-auth-library';
import { Readable } from 'stream';

export class DriveFileHandler implements IFileHandler {

    private readonly allowedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    private readonly driveService: drive_v3.Drive;

    constructor(auth: GoogleAuth) {
        this.driveService = google.drive({
            version: 'v3',
            auth: auth,
        });
        
        auth.getProjectId().then(projectId => {
            console.log(`Autenticado en el proyecto: ${projectId}`);
        });
    }

    private isValidFileType(fileType: string): boolean {
        return this.allowedFileTypes.includes(fileType);
    }

    async save(fileName: string, data: File): Promise<string> {
        if (!this.isValidFileType(data.type)) {
            throw new Error("Invalid file type.");
        }

        const buffer = Buffer.from(await data.arrayBuffer());
        const stream = Readable.from(buffer);

        try {
            const fileMetadata = {
                name: fileName,
                parents: ['1Y7siaaujpdYZsucYmr2WiO8VImoXGtSr'],  
            };

            
            const res = await this.driveService.files.create({
                requestBody: fileMetadata,
                media: {
                    mimeType: data.type,
                    body: stream
                },
                fields: 'id, webContentLink',
            });

            const fileId = res.data.id;

            if (!fileId) {
                throw new Error("Failed to get file ID.");
            }

            await this.driveService.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader', // 'reader' allows anyone to view
                    type: 'anyone', // Makes the file accessible to anyone
                }
            });

            const fileLink = `https://drive.google.com/uc?id=${fileId}&export=download`;

            console.log(`File uploaded to Drive with ID: ${fileLink}`);

            return fileLink || '';
        } catch (error: any) {
            throw new Error(`Failed to upload file to Drive: ${error.message}`);
        }
    }

    

    async read(filePath: string): Promise<File> {
        try {
            const fileId = path.basename(filePath);
            const res = await this.driveService.files.get({
                fileId: fileId,
                alt: 'media',
            }, { responseType: 'stream' });

            const chunks: Buffer[] = [];
            res.data.on('data', chunk => chunks.push(chunk));
            await new Promise(resolve => res.data.on('end', resolve));
            const fileBuffer = Buffer.concat(chunks);
            
            return new File([fileBuffer], filePath);
        } catch (error: any) {
            throw new Error(`Failed to read file from Drive: ${error.message}`);
        }
    }

    async delete(fileLink: string): Promise<void> {
        try {
            const matches = fileLink.match(/[-\w]{25,}/);
            if (!matches) {
                throw new Error('Invalid file link');
            }
    
            const fileId = matches[0]; 
    
            await this.driveService.files.delete({
                fileId: fileId,
            });
    
            console.log(`File with ID: ${fileId} deleted successfully.`);
        } catch (error: any) {
            throw new Error(`Failed to delete file from Drive: ${error.message}`);
        }
    }
    
}
