export abstract class NotificationPayload {
    private id: string;

    constructor(id: string) {
        this.id = id;
    }

    public get getId(): string {
        return this.id;
    }
}