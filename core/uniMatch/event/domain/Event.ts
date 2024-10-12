
import { AggregateRoot } from "../../../shared/domain/AggregateRoot ";
import { DomainError } from "../../../shared/domain/DomainError";
import { Location } from "../../../shared/domain/Location";
import { EventIsDeleted } from "./events/EventIsDeletedEvent";
import { EventIsModified } from "./events/EventIsModifiedEvent";

export class Event extends AggregateRoot {
    private readonly MAX_SIZE: number = 1000000; // 1MB
    private _title: string;
    private _price?: number;
    private _location: Location;
    private _date: Date;
    private _ownerId: string;
    private _participants: string[] = [];
    private _likes: string[] = [];
    private _thumbnail?: string;

    constructor(
        title: string,
        location: Location,
        date: Date,
        ownerId: string,
        participants: string[] = [],
        likes: string[] = [],
        price?: number,
        thumbnail?: string
    ) {
        super();
        this._title = title;
        this._price = price;
        this._location = location;
        this._date = date;
        this._ownerId = ownerId;
        this._participants = participants;
        this._likes = likes;
        this._thumbnail = thumbnail;
    }


    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get price(): number | undefined {
        return this._price;
    }

    public set price(value: number | undefined) {
        this._price = value;
    }

    public get location(): Location {
        return this._location;
    }

    public set location(value: Location) {
        this._location = value;
    }

    public get date(): Date {
        return this._date;
    }

    public set date(value: Date) {
        this._date = value;
    }

    public get ownerId(): string {
        return this._ownerId;
    }

    public set ownerId(value: string) {
        this._ownerId = value;
    }

    public get participants(): string[] {
        return this._participants;
    }

    public set participants(value: string[]) {
        this._participants = value;
    }

    public get likes(): string[] {
        return this._likes;
    }

    public set likes(value: string[]) {
        this._likes = value;
    }

    public get thumbnail(): string | undefined {
        return this._thumbnail;
    }

    public set thumbnail(value: string | undefined) {
        this._thumbnail = value;
    }

    public addParticipant(participantId: string): void {
        if (!this._participants.includes(participantId)) {
            this._participants.push(participantId);
        }
    }

    public removeParticipant(participantId: string): void {
        if (participantId === this._ownerId) {
            throw new DomainError('The owner cannot be removed from the participants.');
        }
        this._participants = this._participants.filter((participant) => participant !== participantId);
    }

    public like(userId: string): void {
        if (!this._likes.includes(userId)) {
            this._likes.push(userId);
        }
    }

    public dislike(userId: string): void {
        this._likes = this._likes.filter((like) => like !== userId);
    }

    public isValidThumbnail(file: File): boolean {
        // Comprobar si es una imagen
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        // Verificar el tamaño y el tipo
        if (file.size > this.MAX_SIZE) {
            throw new DomainError('The file exceeds the maximum size allowed.');
        }

        if (!validImageTypes.includes(file.type)) {
            throw new DomainError('The file is not a valid image.');
        }

        return true;
    }

    public delete(): void {
        this.makeInactive();
        this.recordEvent(new EventIsDeleted(
            this.getId().toString(),
            this.title
        ));
    }

    public edit(title: string, location: Location, date: Date, price?: number, thumbnail?: string): void {
        this.title = title;
        this.location = location;
        this.date = date;
        this.price = price;
        this.thumbnail = thumbnail;

        this.recordEvent(new EventIsModified(
            this.getId().toString(),
            this.title,
            this.location.toString(),
            this.thumbnail
        ));
    }
    
}
