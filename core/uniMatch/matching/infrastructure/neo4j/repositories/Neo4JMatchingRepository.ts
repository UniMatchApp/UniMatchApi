// MatchingRepository.ts
import {Driver, session} from 'neo4j-driver';
import { IMatchingRepository } from '../../../application/ports/IMatchingRepository';
import { Node } from '../../../domain/Node';
import { Like } from '../../../domain/relations/Like';
import { Dislike } from '../../../domain/relations/Dislike';
import driver from '../Config';

export class Neo4JMatchingRepository implements IMatchingRepository {
    private driver: Driver;

    constructor() {
        this.driver = driver;
        console.log("Neo4JMatchingRepository::constructor() -> Neo4j driver created")
    }

    async findUsersThatLikeUser(userId: string): Promise<Node[]> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                'MATCH (u1:User)-[:LIKES]->(u2:User {userId: $userId}) RETURN u1',
                { userId }
            );
            return result.records.map((record: any): Node => {
                const userNode: any = record.get('u1').properties;
                return new Node(
                    userNode.userId,
                    userNode.age,
                    userNode.location,
                    userNode.maxDistance,
                    userNode.gender,
                    userNode.relationshipType,
                    userNode.genderPriority
                );
            });
        } finally {
            await session.close();
        }
    }

    async findPotentialMatches(userId: string, limit: number): Promise<Node[]> {
        const session = this.driver.session();
    
        try {
            const result = await session.run(
                `
                MATCH (u1:User {userId: $userId})
                MATCH (u2:User)
                WHERE u2.userId <> $userId
                  AND (u1.genderPriority IS NULL OR u2.gender = u1.genderPriority)
                  AND NOT (u1)-[:DISLIKES]->(u2)
                  AND NOT (u1)-[:LIKES]->(u2)
                WITH u2,
                    (CASE 
                        WHEN u1.location IS NULL OR u2.location IS NULL THEN 1
                        WHEN u1.maxDistance = 0 OR distance(
                            point({longitude: u1.location.longitude, latitude: u1.location.latitude}),
                            point({longitude: u2.location.longitude, latitude: u2.location.latitude})
                         ) <= u1.maxDistance * 1000 THEN 1 
                        ELSE 0 
                     END +
                     CASE WHEN u2.relationshipType = u1.relationshipType THEN 1 ELSE 0 END) AS priority
                ORDER BY priority DESC
                LIMIT $limit
                RETURN u2
                `,
                { userId, limit }
            );
    
            return result.records.map((record: any): Node => {
                const userNode: any = record.get('u2').properties;
                return new Node(
                    userNode.userId,
                    userNode.age,
                    userNode.maxDistance,
                    userNode.gender,
                    userNode.relationshipType,
                    userNode.genderPriority,
                    userNode.location,
                );
            });
        } finally {
            await session.close();
        }
    }    
    
    
    
    async findMutualLikes(userId: string): Promise<Node[]> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                `
                MATCH (u1:User {userId: $userId})-[:LIKES]->(u2:User)
                MATCH (u2)-[:LIKES]->(u1)
                RETURN u2
                `,
                { userId }
            );
            return result.records.map((record: any): Node => {
                const userNode: any = record.get('u2').properties;
                return new Node(
                    userNode.userId,
                    userNode.age,
                    userNode.maxDistance,
                    userNode.gender,
                    userNode.relationshipType,
                    userNode.genderPriority,
                    userNode.location,
                );
            });
        } finally {
            await session.close();
        }
    }
    
    async create(entity: Node): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                'CREATE (u:User {userId: $userId, age: $age, location: $location, maxDistance: $maxDistance, gender: $gender, relationshipType: $relationshipType, genderPriority: $genderPriority})',
                {
                    userId: entity.userId,
                    age: entity.age,
                    location: entity.location?.toString() || null,
                    maxDistance: entity.maxDistance,
                    gender: entity.gender,
                    relationshipType: entity.relationshipType,
                    genderPriority: entity.genderPriority
                }
            );
        } finally {
            await session.close();
        }
    }

    async update(entity: Node, id: string): Promise<Node> {
        const session = this.driver.session();
        try {
            await session.run(
                'MATCH (u:User {userId: $userId}) ' +
                'SET u.age = $age, u.location = $location, u.maxDistance = $maxDistance, u.gender = $gender, u.relationshipType = $relationshipType, u.genderPriority = $genderPriority',
                {
                    userId: id,
                    age: entity.age,
                    location: entity.location?.toString() || null,
                    maxDistance: entity.maxDistance,
                    gender: entity.gender,
                    relationshipType: entity.relationshipType,
                    genderPriority: entity.genderPriority
                }
            );
            return entity;
        } finally {
            await session.close();
        }
    }

    async findById(id: string): Promise<Node | null> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                'MATCH (u:User {userId: $userId}) RETURN u',
                { userId: id }
            );

            const record = result.records[0];
            if (record) {
                const userNode = record.get('u').properties;
                return new Node(
                    userNode.userId,
                    userNode.age,
                    userNode.maxDistance,
                    userNode.gender,
                    userNode.relationshipType,
                    userNode.genderPriority,
                    userNode.location
                );
            }
            return null;
        } finally {
            await session.close();
        }
    }

    async findAll(): Promise<Node[]> {
        const session = this.driver.session();
        try {
            const result = await session.run('MATCH (u:User) RETURN u');
            return result.records.map((record: any): Node => {
                const userNode: any = record.get('u').properties;
                return new Node(
                    userNode.userId,
                    userNode.age,
                    userNode.maxDistance,
                    userNode.gender,
                    userNode.relationshipType,
                    userNode.genderPriority,
                    userNode.location
                );
            });
        } finally {
            await session.close();
        }
    }

    async deleteById(id: string): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                'MATCH (u:User {userId: $userId}) DELETE u',
                { userId: id }
            );
        } finally {
            await session.close();
        }
    }

    async deleteAll(): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run('MATCH (u:User) DELETE u');
        } finally {
            await session.close();
        }
    }

    async existsById(id: string): Promise<boolean> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                'MATCH (u:User {userId: $userId}) RETURN COUNT(u) AS count',
                { userId: id }
            );
            return result.records[0].get('count').toNumber() > 0;
        } finally {
            await session.close();
        }
    }

    async findByUserId(userId: string): Promise<Node | undefined> {
        const node = await this.findById(userId);
        if (node) {
            return node;
        }
    }

    async likeUser(like: Like): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                'MATCH (u1:User {userId: $fromUserId}), (u2:User {userId: $toUserId}) ' +
                'CREATE (u1)-[:LIKES]->(u2)',
                { fromUserId: like.fromProfile.getId(), toUserId: like.toProfile.getId() }
            );
        } finally {
            await session.close();
        }
    }

    async dislikeUser(dislike: Dislike): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                'MATCH (u1:User {userId: $fromUserId}), (u2:User {userId: $toUserId}) ' +
                'CREATE (u1)-[:DISLIKES]->(u2)',
                { fromUserId: dislike.fromProfile.getId(), toUserId: dislike.toProfile.getId() }
            );
        } finally {
            await session.close();
        }
    }
}
