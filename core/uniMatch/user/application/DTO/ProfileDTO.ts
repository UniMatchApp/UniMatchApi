import {Profile} from "@/core/uniMatch/user/domain/Profile";


export interface ProfileDTO {
    profileId: string;
    userId: string;
    name: string;
    age: number;
    aboutMe: string;
    location?: { latitude: number, longitude: number, altitude?: number };
    gender: string;
    sexualOrientation: string;
    relationshipType: string;
    birthday: Date;
    interests: string[];
    wall: string[];
    preferredImage: string;
    maxDistance: number;
    ageRange: { min: number, max: number}
    horoscope?: string;
    height?: number;
    weight?: number;
    job?: string;
    education?: string;
    personalityType?: string;
    pets?: string;
    drinks?: string;
    smokes?: string;
    doesSports?: string;
    valuesAndBeliefs?: string;
    genderPriority?: string;
    fact?: string;

}

export namespace ProfileDTO {
    export function fromProfile(profile: Profile): ProfileDTO {

        const location = profile.location ?? undefined;

        return {
            profileId: profile.getId().toString(),
            userId: profile.userId,
            name: profile.name,
            age: profile.age,
            aboutMe: profile.aboutMe,
            location: profile.location ? {
                latitude: profile.location.latitude,
                longitude: profile.location.longitude,
                altitude: profile.location.altitude,
            } : undefined,
            gender: profile.gender.toString(),
            sexualOrientation: profile.sexualOrientation.toString(),
            relationshipType: profile.relationshipType.toString(),
            birthday: profile.birthday,
            interests: profile.interests || [],
            wall: profile.wall || [],
            preferredImage: profile.preferredImage,
            maxDistance: profile.maxDistance,
            ageRange: { min: profile.ageRange[0], max: profile.ageRange[1] },
            horoscope: profile.horoscope?.toString(),
            height: profile.height ?? undefined,
            weight: profile.weight ?? undefined,
            job: profile.job ?? undefined,
            education: profile.education ?? undefined,
            personalityType: profile.personalityType ?? undefined,
            pets: profile.pets ?? undefined,
            drinks: profile.drinks?.toString(),
            smokes: profile.smokes?.toString(),
            doesSports: profile.doesSports?.toString(),
            valuesAndBeliefs: profile.valuesAndBeliefs?.toString(),
            genderPriority: profile.genderPriority?.toString(),
            fact: profile.fact ?? undefined,
        };

    }
}