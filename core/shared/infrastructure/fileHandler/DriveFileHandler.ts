import { IFileHandler } from '@/core/shared/application/IFileHandler';
import { google, drive_v3 } from 'googleapis';
import * as path from 'path';
import { GoogleAuth } from 'google-auth-library';
import { Readable } from 'stream';
import { fileTypeFromBuffer } from 'file-type';
import crypto from 'crypto';

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

    private generateRandomFileName(extension: string): string {
        return crypto.randomBytes(16).toString('hex') + extension;
    }

    async save(fileName: string, data: File): Promise<string> {
        if (!this.isValidFileType(data.type)) {
            throw new Error("Invalid file type.");
        }

        const buffer = Buffer.from(await data.arrayBuffer());

        // Detectar el tipo MIME real del archivo
        const fileType = await fileTypeFromBuffer(buffer);
        if (!fileType || !this.isValidFileType(fileType.mime)) {
            throw new Error("Invalid file type detected from content.");
        }

        if (data.type !== fileType.mime) {
            throw new Error("Declared file type does not match actual file type.");
        }

        // Generar un nombre aleatorio para el archivo
        const extname = path.extname(fileName) || `.${fileType.ext}`;
        const randomFileName = this.generateRandomFileName(extname);

        const stream = Readable.from(buffer);

        try {
            const fileMetadata = {
                name: randomFileName,  // Usar el nombre aleatorio
                parents: ['1Y7siaaujpdYZsucYmr2WiO8VImoXGtSr'],
            };

            const res = await this.driveService.files.create({
                requestBody: fileMetadata,
                media: {
                    mimeType: data.type,
                    body: stream,
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
                    role: 'reader',
                    type: 'anyone',
                },
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
