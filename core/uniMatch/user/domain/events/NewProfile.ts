import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { User } from "../User";
import { Location } from "@/core/shared/domain/Location";
import { Gender } from "@/core/shared/domain/Gender";
import { RelationshipType } from "../../../../shared/domain/RelationshipType";
import { Profile } from "../Profile";

export class NewProfile extends DomainEvent {
    constructor(
        aggregateId: string,
        age: number,
        gender: string,
        maxDistance: number,
        genderPriority: Gender | undefined,
        relationshipType: RelationshipType,
        location?: Location,
    ) {
        super(aggregateId, "new-profile");
        this.getPayload().set("age", age.toString());
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
            profile.getId().toString(),
            profile.age,
            profile.gender.toString(),
            profile.maxDistance,
            profile.genderPriority,
            profile.relationshipType,
            profile.location
        );
    }
}
