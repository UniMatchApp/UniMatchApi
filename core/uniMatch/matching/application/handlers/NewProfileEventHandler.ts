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
            const eventPayload = event.getEventId()
            console.log("eventPayload", eventPayload)
            const id = event.getAggregateId();

            console.log("id: " + id)

            const locationStr = event.getPayload().get("location");

            console.log("location str: ", locationStr)
    
            const genderStr = event.getPayload().get("gender")
            if (!genderStr) {
                throw new EventError("Gender is required to create a new user.");
            }

            console.log("gender str: ", genderStr)
    
            const relationshipTypeStr = event.getPayload().get("relationshipType");
            if (!relationshipTypeStr) {
                throw new EventError("Relationship Type is required to create a new user.");
            }

            console.log("relationsship str: ", relationshipTypeStr)
    
            const genderPriorityStr = event.getPayload().get("genderPriority");
            let genderPriority: Gender | undefined;
            if (genderPriorityStr) {
                genderPriority = new Gender(Gender.fromString(genderPriorityStr))
            }
    
            const ageStr = event.getPayload().get("age");
            if (!ageStr) {
                throw new EventError("Age is required to create a new user.");
            }

            const ageRangeStr = event.getPayload().get("ageRange");
            if (!ageRangeStr) {
                throw new EventError("Age Range is required to create a new user.");
            }
    
            const maxDistanceStr = event.getPayload().get("maxDistance");
            if (!maxDistanceStr) {
                throw new EventError("Max distance is required to create a new user.");
            }
    
            const relationshipType = RelationshipType.fromString(relationshipTypeStr);
            const max = Number(maxDistanceStr);
            const gender = new Gender(Gender.fromString(genderStr))
            const location = locationStr ? Location.stringToLocation(locationStr) : undefined;
            console.log("ageRangeStr: " + ageRangeStr)
            const parsedAgeRange = ageRangeStr.split(',').map(Number) as [number, number];
    
            const node = new Node(
                id,
                Number(ageStr),
                parsedAgeRange,
                max,
                gender,
                relationshipType,
                genderPriority,
                location
            );
    
            await this.repository.create(node);
        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "new-profile";
    }
}
