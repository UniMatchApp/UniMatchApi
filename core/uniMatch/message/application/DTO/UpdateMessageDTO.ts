
export class UpdateMessageDTO {
    constructor(
        public readonly messageId: string,
        public readonly content: string,
        public readonly attachment?: string
        
    ) {}
}