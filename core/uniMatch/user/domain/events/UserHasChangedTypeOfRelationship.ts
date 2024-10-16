import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";
import { RelationshipType } from "../RelationshipType";

export class UserHasChangedTypeOfRelationship extends DomainEvent {
    constructor(aggregateId: string, relationshipType: RelationshipType) {
        super(aggregateId, "user-has-changed-type-of-relationship");
        this.getPayload().set("relationshipType", relationshipType.toString());
    }

    public static from(profile: Profile): UserHasChangedTypeOfRelationship {
        return new UserHasChangedTypeOfRelationship(profile.getId(), profile.relationshipType);
    }
}