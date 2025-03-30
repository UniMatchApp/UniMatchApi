export interface UserDTO {
    id: string;
    email: string;
    registered: boolean;
    registrationDate: Date;
    blockedUsers: string[];
    reportedUsers: string[];
}

export namespace UserDTO {
    export function mapProfileToUserDTO(profile: any): UserDTO {
        return {
            id: profile.id,
            email: profile.email,
            registered: profile.registered,
            registrationDate: profile.registrationDate,
            blockedUsers: profile.blockedUsers,
            reportedUsers: profile.reportedUsers,
        };
    }
}