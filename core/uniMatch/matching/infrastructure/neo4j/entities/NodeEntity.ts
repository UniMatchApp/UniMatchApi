export class NodeEntity {
    entityId: string;
    userId: string;
    age: number;
    ageRange: [number, number];
    maxDistance: number;
    gender: string;
    relationshipType: string;
    genderPriority?: string;
    location?: string;

    constructor(
        id: string,
        userId: string,
        age: number,
        ageRange: [number, number],
        maxDistance: number,
        gender: string,
        relationshipType: string,
        genderPriority?: string,
        location?: string
    ) {
        this.entityId = id;
        this.userId = userId;
        this.age = age;
        this.ageRange = ageRange;
        this.maxDistance = maxDistance;
        this.gender = gender;
        this.relationshipType = relationshipType;
        this.genderPriority = genderPriority;
        this.location = location;
    }
}
