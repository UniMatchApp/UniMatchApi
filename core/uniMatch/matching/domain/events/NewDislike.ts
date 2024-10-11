import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class NewLike extends DomainEvent {
    constructor(aggregateId: string, dislikedProfileId: string) {
        super(aggregateId, "new-dislike");
        this.getPayload().set("dislikedProfileId", dislikedProfileId);
    }

    public static from(senderProfile: Profile, dislikedProfileId: string): NewLike {
        return new NewLike(
            senderProfile.getId().toString(),
            dislikedProfileId
        );
    }
}
