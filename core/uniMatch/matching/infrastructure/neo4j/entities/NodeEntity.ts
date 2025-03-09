export class NodeEntity {
    entityId: string;
    userId: string;
    age: number;
    ageRange: [number, number];
    maxDistance: number;
    gender: string;
    relationshipType: string;
    genderPriority?: string;
    latitude?: number;
    longitude?: number;
    lookingRandom: boolean;

    constructor(
        id: string,
        userId: string,
        age: number,
        ageRange: [number, number],
        maxDistance: number,
        gender: string,
        relationshipType: string,
        lookingRandom: boolean,
        genderPriority?: string,
        location?: string,
    ) {
        this.entityId = id;
        this.userId = userId;
        this.age = age;
        this.ageRange = ageRange;
        this.maxDistance = maxDistance;
        this.gender = gender;
        this.relationshipType = relationshipType;
        this.genderPriority = genderPriority;
        this.lookingRandom = lookingRandom;
        if (location) {
            const [latitude, longitude] = location.split(',');
            this.latitude = parseFloat(latitude);
            this.longitude = parseFloat(longitude);
        }
    }
}
