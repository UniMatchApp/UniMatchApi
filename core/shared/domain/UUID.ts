import { v4 as uuidV4 } from 'uuid';

export class UUID {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static generate(): UUID {
        const newValue = uuidV4();
        return new UUID(newValue);
    }

    public static fromString(value: string): UUID {
        return new UUID(value);
    }

    public toString(): string {
        return this.value;
    }
}
