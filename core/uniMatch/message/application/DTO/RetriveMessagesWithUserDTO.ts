export class RetriveMessagesWithUserDTO {
    constructor(
        public readonly user: string,
        public readonly targetUser: string
    ) {}
}