import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Location } from "@/core/shared/domain/Location";
import { Gender } from "@/core/shared/domain/Gender";
import { RelationshipType } from "@/core/shared/domain/RelationshipType";
import { Profile } from "../Profile";

export class NewProfile extends DomainEvent {
    constructor(
        aggregateId: string,
        age: number,
        ageRange: [number, number],
        gender: string,
        maxDistance: number,
        genderPriority: Gender | undefined,
        relationshipType: RelationshipType,
        location?: Location,
    ) {
        super(aggregateId, "new-profile");
        this.getPayload().set("age", age.toString());
        this.getPayload().set("ageRange", ageRange.toString());
        this.getPayload().set("gender", gender.toString());
        this.getPayload().set("maxDistance", maxDistance.toString());
        this.getPayload().set("genderPriority", genderPriority?.toString() || "");
        this.getPayload().set("relationshipType", relationshipType.toString());
        if (location) {
            this.getPayload().set("location", location.toString());
        }
    }

    public static from(profile: Profile): NewProfile {
        return new NewProfile(
            profile.userId,
            profile.age,
            profile.ageRange,
            profile.gender.toString(),
            profile.maxDistance,
            profile.genderPriority,
            profile.relationshipType,
            profile.location
        );
    }
}
