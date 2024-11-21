export abstract class NotificationPayload {
    private readonly id: string;

    protected constructor(id: string) {
        this.id = id;
    }

    public get getId(): string {
        return this.id;
    }
}