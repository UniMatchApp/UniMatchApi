export class CreateNewEventDTO {
    constructor(
        public readonly title: string,
        public readonly date: Date,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly altitude: number,
        public readonly ownerId: string,
        public readonly thumbnail?: File,
        public readonly price?: number,
    ) {}
}