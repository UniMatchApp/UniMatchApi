import { Location } from "@/core/shared/domain/Location";
import { SexualOrientation } from "../../../domain/SexualOrientation";
import { ProfileEntity } from "../models/ProfileEntity";
import { Profile } from "../../../domain/Profile";
import { Gender } from "@/core/shared/domain/Gender";
import { RelationshipType } from "@/core/shared/domain/RelationshipType";
import { AllowedRelationshipType } from "@/core/shared/domain/RelationshipType";
import { Horoscope } from "../../../domain/Horoscope";

export class ProfileMapper {
    static toDomain(entity: ProfileEntity): Profile {
        const location = new Location(entity.latitude, entity.longitude, entity.altitude);
        const sexualOrientation = new SexualOrientation(entity.sexualOrientation);
        const gender = new Gender(entity.gender);
        const genderPriority = entity.genderPriority ? new Gender(entity.genderPriority) : undefined;
        const relationshipType = new RelationshipType(entity.relationshipType as AllowedRelationshipType);
        const horoscope = entity.horoscope ? new Horoscope(entity.horoscope) : undefined;
        
        const profile = new Profile(
            entity.userId,
            entity.name,
            entity.age,
            entity.aboutMe,
            gender,
            location,
            sexualOrientation,
            relationshipType,
            entity.birthday,
            entity.interests,
            entity.wall
        );

        profile.setId(entity.id);
        profile.fact = entity.fact;
        profile.height = entity.height;
        profile.weight = entity.weight;
        profile.job = entity.job;
        profile.education = entity.education;
        profile.personalityType = entity.personalityType;
        profile.pets = entity.pets;
        profile.drinks = entity.drinks;
        profile.smokes = entity.smokes;
        profile.doesSports = entity.doesSports;
        profile.valuesAndBeliefs = entity.valuesAndBeliefs;
        profile.wall = entity.wall;
        profile.maxDistance = entity.maxDistance;
        profile.ageRange = entity.ageRange;
        profile.horoscope = horoscope;
        profile.genderPriority = genderPriority;
        
        return profile;
    }

    static toEntity(profile: Profile): ProfileEntity {
        const entity = new ProfileEntity();
        entity.id = profile.getId().toString();
        entity.userId = profile.userId;
        entity.name = profile.name;
        entity.age = profile.age;
        entity.aboutMe = profile.aboutMe;
        entity.latitude = profile.location.latitude;
        entity.longitude = profile.location.longitude;
        entity.altitude = profile.location.altitude;
        entity.fact = profile.fact;
        entity.interests = profile.interests;
        entity.gender = profile.gender.value;
        entity.height = profile.height;
        entity.weight = profile.weight
        entity.sexualOrientation = profile.sexualOrientation.value;
        entity.job = profile.job;
        entity.relationshipType = profile.relationshipType.value;
        entity.horoscope = profile.horoscope?.value;
        entity.education = profile.education;
        entity.personalityType = profile.personalityType;
        entity.pets = profile.pets;
        entity.drinks = profile.drinks;
        entity.smokes = profile.smokes;
        entity.doesSports = profile.doesSports;
        entity.valuesAndBeliefs = profile.valuesAndBeliefs;
        entity.wall = profile.wall;
        entity.birthday = profile.birthday;
        entity.maxDistance = profile.maxDistance;
        entity.ageRange = profile.ageRange;
        entity.genderPriority = profile.genderPriority?.value;
        return entity;
    }

}