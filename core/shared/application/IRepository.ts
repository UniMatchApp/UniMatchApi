import { UUID } from "../domain/UUID";

export interface IRepository<T> {
    save(entity: T): void;
    findById(id: string): T | null;
    findAll(): T[];
    deleteById(id: string): void;
    deleteAll(): void;
    existsById(id: string): boolean;
    update(entity: T, id: string): T;
}
