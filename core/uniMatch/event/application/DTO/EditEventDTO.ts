export class EditEventDTO {
    constructor(
        public readonly eventId: string,
        public readonly title: string,
        public readonly date: Date,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly altitude: number,
        public readonly image?: string,
        public readonly thumbnail?: string,
        public readonly price?: number,
        
    ) {}
}
