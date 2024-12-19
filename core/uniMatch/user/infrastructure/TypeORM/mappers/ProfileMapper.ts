import { Location } from "@/core/shared/domain/Location";
import { SexualOrientation } from "../../../domain/SexualOrientation";
import { ProfileEntity } from "../models/ProfileEntity";
import { Profile } from "../../../domain/Profile";
import { Gender } from "@/core/shared/domain/Gender";
import { RelationshipType } from "@/core/shared/domain/RelationshipType";
import { AllowedRelationshipType } from "@/core/shared/domain/RelationshipType";
import { Horoscope } from "../../../domain/Horoscope";
import { HabitsEnum } from "../../../domain/enum/HabitsEnum";
import { ValuesAndBeliefsEnum } from "../../../domain/enum/ValuesAndBeliefsEnum";
import { TransformFromUndefinedToNull } from "@/core/shared/infrastructure/decorators/TransformFromUndefinedToNull";

export class ProfileMapper {
    static toDomain(entity: ProfileEntity): Profile {
        const location = (entity.latitude && entity.longitude) ? new Location(entity.latitude, entity.longitude, entity.altitude || undefined) : undefined;
        const drinks = entity.drinks ? HabitsEnum[entity.drinks as keyof typeof HabitsEnum] : undefined;
        const smokes = entity.smokes ? HabitsEnum[entity.smokes as keyof typeof HabitsEnum] : undefined;
        const doesSports = entity.doesSports ? HabitsEnum[entity.doesSports as keyof typeof HabitsEnum] : undefined;
        const valuesAndBeliefs = entity.valuesAndBeliefs ? ValuesAndBeliefsEnum[entity.valuesAndBeliefs as keyof typeof ValuesAndBeliefsEnum] : undefined;
        const sexualOrientation = new SexualOrientation(SexualOrientation.fromString(entity.sexualOrientation));
        const gender = new Gender(Gender.fromString(entity.gender));
        const genderPriority = entity.genderPriority ? new Gender(Gender.fromString(entity.genderPriority)) : undefined;
        const relationshipType = new RelationshipType(entity.relationshipType as AllowedRelationshipType);
        const horoscope = entity.horoscope ? new Horoscope(entity.horoscope) : undefined;

        
        const profile = new Profile(
            entity.userId,
            entity.name,
            entity.age,
            entity.aboutMe,
            gender,
            sexualOrientation,
            relationshipType,
            entity.birthday,
            entity.interests,
            entity.wall,
            location
        );

        profile.setId(entity.id);
        profile.fact = entity.fact || undefined;
        profile.height = entity.height || undefined;
        profile.weight = entity.weight || undefined;
        profile.job = entity.job || undefined;
        profile.education = entity.education || undefined;
        profile.personalityType = entity.personalityType || undefined;
        profile.pets = entity.pets || undefined;
        profile.drinks = drinks;
        profile.smokes = smokes;
        profile.doesSports = doesSports;
        profile.valuesAndBeliefs = valuesAndBeliefs;
        profile.wall = entity.wall;
        profile.preferredImage = entity.preferredImage;
        profile.maxDistance = entity.maxDistance;
        profile.ageRange = entity.ageRange;
        profile.horoscope = horoscope;
        profile.genderPriority = genderPriority;

        profile.clearEvents();
        
        return profile;
    }

    @TransformFromUndefinedToNull
    static toEntity(profile: Profile): ProfileEntity {
        const entity = new ProfileEntity();
        entity.id = profile.getId().toString();
        entity.userId = profile.userId;
        entity.name = profile.name;
        entity.age = profile.age;
        entity.aboutMe = profile.aboutMe;
        entity.latitude = profile.location?.latitude;
        entity.longitude = profile.location?.longitude;
        entity.altitude = profile.location?.altitude;
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
        entity.preferredImage = profile.preferredImage;
        entity.birthday = profile.birthday;
        entity.maxDistance = profile.maxDistance;
        entity.ageRange = profile.ageRange;
        entity.genderPriority = profile.genderPriority?.value;
        return entity;
    }

}