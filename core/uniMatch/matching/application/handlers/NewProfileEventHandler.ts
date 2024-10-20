import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Node } from "../../domain/Node";
import { Location } from "@/core/shared/domain/Location";
import { Gender } from "@/core/shared/domain/Gender";
import { RelationshipType } from "@/core/shared/domain/RelationshipType";
import { EventError } from "@/core/shared/exceptions/EventError";

export class NewProfileEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const id = event.getAggregateId();

            const locationStr = event.getPayload().get("location");
            if (!locationStr) {
                throw new EventError("Location is required to create a new user.");
            }
    
            const genderStr = event.getPayload().get("gender")
            if (!genderStr) {
                throw new EventError("Gender is required to create a new user.");
            }
    
            const relationshipTypeStr = event.getPayload().get("relationshipType");
            if (!relationshipTypeStr) {
                throw new EventError("Relationship Type is required to create a new user.");
            }
    
            const genderPriorityStr = event.getPayload().get("genderPriority");
            let genderPriority: Gender | undefined;
            if (genderPriorityStr) {
                genderPriority = Gender.fromString(genderPriorityStr);
            }
    
            const ageStr = event.getPayload().get("age");
            if (!ageStr) {
                throw new EventError("Age is required to create a new user.");
            }
    
            const maxDistanceStr = event.getPayload().get("maxDistance");
            if (!maxDistanceStr) {
                throw new EventError("Max distance is required to create a new user.");
            }
    
            const relationshipType = RelationshipType.fromString(relationshipTypeStr);
            const max = Number(maxDistanceStr);
            const gender = Gender.fromString(genderStr);
            const location = Location.stringToLocation(locationStr);
    
    
            const node = new Node(
                id,
                Number(ageStr),
                location,
                max,
                gender,
                relationshipType,
                genderPriority
            );
    
            this.repository.save(node);
        } catch (error : any) {
            throw error;
        }
    }

    getEventId(): string {
        return "new-profile";
    }
}
