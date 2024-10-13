import { DomainError } from "@/core/shared/domain/DomainError";

export class RelationshipType {
    private _value: string;
    private static readonly allowedRelationshipTypes = ["FRIENDSHIP", "CASUAL", "LONG-TERM", "OPEN", "OTHER"];

    constructor(value: string) {
        this._value = value;
    }

    public get value(): string {
        return this._value;
    }

    public setValue(value: string): void {
        const uppercasedValue = value.toUpperCase();
        if (!RelationshipType.allowedRelationshipTypes.includes(uppercasedValue)) {
            throw new DomainError(`Relationship type must be one of the following: ${RelationshipType.allowedRelationshipTypes.join(", ")}.`);
        }
        this._value = uppercasedValue;
    }

    public toString(): string {
        return this._value;
    }
}
