export interface IFileHandler {
    save(filePath: string, data: File): string;
    read(filePath: string): File;
    delete(filePath: string): void;
    isValid(filePath: File): boolean;
}
