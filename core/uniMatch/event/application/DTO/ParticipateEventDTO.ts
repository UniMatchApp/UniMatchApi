export class ParticipateEventDTO {
    constructor(
        public readonly eventId: string,
        public readonly userId: string
    ) {}
}