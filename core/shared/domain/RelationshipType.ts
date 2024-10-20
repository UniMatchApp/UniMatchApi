import { DomainError } from "@/core/shared/exceptions/DomainError";

// Definimos un type para los valores permitidos
export type AllowedRelationshipType = "FRIENDSHIP" | "CASUAL" | "LONG-TERM" | "OPEN" | "OTHER";

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

    // Método para crear una instancia desde un string
    public static fromString(value: string): RelationshipType {
        const uppercasedValue = value.toUpperCase() as AllowedRelationshipType;
        if (!RelationshipType.isValidRelationshipType(uppercasedValue)) {
            throw new DomainError(`Relationship type must be one of the following: FRIENDSHIP, CASUAL, LONG-TERM, OPEN, OTHER.`);
        }
        return new RelationshipType(uppercasedValue);
    }

    // Método para validar si el tipo es permitido
    public static isValidRelationshipType(value: string): value is AllowedRelationshipType {
        return ["FRIENDSHIP", "CASUAL", "LONG-TERM", "OPEN", "OTHER"].includes(value);
    }
}

