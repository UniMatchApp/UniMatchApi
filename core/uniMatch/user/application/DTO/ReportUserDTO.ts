export interface ReportUserDTO {
    id: string;
    reportedUserId: string;
    predefinedReason: string;
    comment?: string;
}