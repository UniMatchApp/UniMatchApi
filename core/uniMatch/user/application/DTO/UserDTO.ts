export interface UserDTO {
    id: string;
    email: string;
    registered: boolean;
    registrationDate: Date;
    blockedUsers: string[];
    reportedUsers: string[];
}