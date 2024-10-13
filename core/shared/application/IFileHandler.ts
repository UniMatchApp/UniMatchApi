export interface IFileHandler {
    save(fileName: string, data: File): string;
    read(filePath: string): File;
    delete(filePath: string): void;
    isValid(filePath: File): boolean;
}
