export interface IRepository<T> {
    save(entity: T): Promise<void>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    deleteById(id: string): Promise<void>;
    deleteAll(): Promise<void>;
    existsById(id: string): Promise<boolean>;
    update(entity: T, id: string): Promise<T>;
}
