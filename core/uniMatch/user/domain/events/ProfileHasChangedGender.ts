import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";
import { Gender } from "../Gender";

export class ProfileHasChangedGender extends DomainEvent {
    constructor(aggregateId: string, gender: Gender) {
        super(aggregateId, "profile-has-changed-gender");
        this.getPayload().set("gender", gender.toString());
    }

    public static from(profile: Profile): ProfileHasChangedGender {
        return new ProfileHasChangedGender(profile.getId(), profile.gender);
    }

    
}
