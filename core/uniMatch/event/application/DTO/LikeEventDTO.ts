export class LikeEventDTO {
    constructor(
        public readonly eventId: string,
        public readonly userId: string
    ) {}
}