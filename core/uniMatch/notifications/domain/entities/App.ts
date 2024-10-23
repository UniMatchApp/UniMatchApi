import { NotificationPayload } from "../NotificationPayload";

export class App extends NotificationPayload {
    private title: string;
    private description: string;

    constructor(id: string, title: string, description: string) {
        super(id);
        this.title = title;
        this.description = description;
    }

    public get getTitle(): string {
        return this.title;
    }

    public set setTitle(title: string) {
        this.title = title;
    }

    public get getDescription(): string {
        return this.description;
    }

    public set setDescription(description: string) {
        this.description = description;
    }
}
