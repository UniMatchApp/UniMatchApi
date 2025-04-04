import { Profile } from "../../domain/Profile";

export interface ProfileInfoDTO {
    id: string;
    name: string;
    avatar: string;
}

export namespace ProfileInfoDTO {
    export function fromProfile (profile: Profile): ProfileInfoDTO {
        return {
            id: profile.userId,
            name:  profile.name,
            avatar: profile.preferredImage
        }
    }
}