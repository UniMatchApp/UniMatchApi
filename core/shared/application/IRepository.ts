export interface IRepository<T> {
    create(entity: T): Promise<void>;
    update(entity: T, id: string): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    deleteById(id: string): Promise<void>;
    deleteAll(): Promise<void>;
    existsById(id: string): Promise<boolean>;
}
