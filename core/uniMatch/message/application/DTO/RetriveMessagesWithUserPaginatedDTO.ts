export interface RetrieveMessagesWithUserPaginatedDTO {
    userId: string;
    targetUserId: string;
    after: number;
    limit: number;
}


