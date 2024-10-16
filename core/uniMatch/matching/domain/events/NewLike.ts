import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class NewLike extends DomainEvent {
    constructor(aggregateId: string, likedProfileId: string) {
        super(aggregateId, "new-like");
        this.getPayload().set("likedProfileId", likedProfileId);
    }

    public static from(senderProfile: Profile, likedProfileId: string): NewLike {
        return new NewLike(
            senderProfile.getId().toString(),
            likedProfileId
        );
    }
}
