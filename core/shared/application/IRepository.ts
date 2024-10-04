import { UUID } from "../domain/UUID";

export interface IRepository<T> {
    save(entity: T): void;
    findById(id: UUID): T | null;
    findAll(): T[];
    deleteById(id: UUID): void;
    existsById(id: UUID): boolean;
    update(entity: T, id: UUID): T;
}
