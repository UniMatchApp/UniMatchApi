export class CreateNewMessageDTO {
    constructor(
        public readonly content: string,
        public readonly status: string,
        public readonly timestamp: Date,
        public readonly sender: string,
        public readonly recipient: string,
        public readonly attachment?: File
    ) {}
}