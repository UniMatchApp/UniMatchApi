import { UUID } from "./UUID";

export class Entity {
    private id: string;
    private isActive: boolean = true;

    constructor() {
        this.id = this.generateUUID();
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getIsActive(): boolean {
        return this.isActive;
    }

    public setIsActive(isActive: boolean): void {
        this.isActive = isActive;
    }

    public makeInactive(): void {
        this.isActive = false;
    }

    private generateUUID(): string {
        return UUID.generate().toString();
    }
}
