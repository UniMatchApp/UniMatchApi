import { Node } from "../../../domain/Node";
import { Location } from "@/core/shared/domain/Location";
import { Gender } from "@/core/shared/domain/Gender";
import { RelationshipType } from "@/core/shared/domain/RelationshipType";
import { NodeEntity } from "../entities/NodeEntity";

export class NodeMapper {
    static toDomain(entity: NodeEntity): Node {
        const location = entity.location ? Location.stringToLocation(entity.location) : undefined;
        const gender = new Gender(Gender.fromString(entity.gender));
        const genderPriority = entity.genderPriority ? new Gender(Gender.fromString(entity.genderPriority)) : undefined;
        const relationshipType = RelationshipType.fromString(entity.relationshipType);
        const ageRange = entity.ageRange;

        const node = new Node(
            entity.userId,
            entity.age,
            ageRange,
            entity.maxDistance,
            gender,
            relationshipType,
            genderPriority,
            location
        );

        node.setId(entity.entityId);
        node.clearEvents();
        return node;
    }

    static toEntity(domain: Node): NodeEntity {
        const entity = new NodeEntity(
            domain.getId().toString(),
            domain.userId,
            domain.age,
            domain.ageRange,
            domain.maxDistance,
            domain.gender.toString(),
            domain.relationshipType.toString(),
            domain.genderPriority?.toString(),
            domain.location?.toString()

        );
        return entity;
    }
}
