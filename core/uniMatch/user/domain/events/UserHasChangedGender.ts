import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";
import { Gender } from "@/core/shared/domain/Gender";


export class ProfileHasChangedGender extends DomainEvent {
    constructor(aggregateId: string, gender: Gender) {
        super(aggregateId, "user-has-changed-gender");
        console.log("ProfileHasChangedGender event created");
        this.getPayload().set("gender", gender.toString());
    }

    public static from(profile: Profile): ProfileHasChangedGender {
        return new ProfileHasChangedGender(profile.getId(), profile.gender);
    }

    
}
