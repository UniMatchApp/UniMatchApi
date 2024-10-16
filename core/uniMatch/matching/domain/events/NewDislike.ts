import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class NewDislike extends DomainEvent {
    constructor(aggregateId: string, dislikedProfileId: string) {
        super(aggregateId, "new-dislike");
        this.getPayload().set("dislikedProfileId", dislikedProfileId);
    }

    public static from(senderProfile: Profile, dislikedProfileId: string): NewDislike {
        return new NewDislike(
            senderProfile.getId().toString(),
            dislikedProfileId
        );
    }
}
