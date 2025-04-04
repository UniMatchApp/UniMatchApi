export interface ReportUserDTO {
    id: string;
    reportedUserId: string;
    predefinedReason: string;
    details: string;
    comment?: string;
    createdAt: string; // ISO 8601 format
}