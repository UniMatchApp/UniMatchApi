import { DomainError } from "@/core/shared/exceptions/DomainError";

// Definimos un type para los valores permitidos
export type AllowedRelationshipType = "FRIENDSHIP" | "CASUAL" | "LONG_TERM" | "OPEN" | "OTHER";

export class RelationshipType {
    private _value: AllowedRelationshipType;

    // Constructor que asigna el valor inicial
    constructor(value: AllowedRelationshipType) {
        this._value = value;
    }

    // Getter para acceder al valor
    public get value(): AllowedRelationshipType {
        return this._value;
    }

    // Método para cambiar el valor asegurándose de que sea válido
    public setValue(value: AllowedRelationshipType): void {
        this._value = value;
    }

    // Convertir a string
    public toString(): string {
        return this._value;
    }

    public static fromString(value: string): RelationshipType {
        if (!["FRIENDSHIP", "CASUAL", "LONG_TERM", "OPEN", "OTHER"].includes(value)) {
            throw new DomainError("Invalid relationship type");
        }
        return new RelationshipType(value as AllowedRelationshipType);
    }
}

