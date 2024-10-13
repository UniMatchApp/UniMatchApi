export interface IFileHandler {
    save(filePath: string, data: Buffer | string): Promise<void>;
    read(filePath: string): Promise<Buffer>;
    delete(filePath: string): Promise<void>;
}
