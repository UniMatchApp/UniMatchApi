export interface IFileHandler {
    save(fileName: string, data: File): Promise<string>;
    read(filePath: string): Promise<File>;
    delete(filePath: string): Promise<void>;
}
