// MatchingRepository.ts
import { Driver } from 'neo4j-driver';
import { IMatchingRepository } from '../../../application/ports/IMatchingRepository';
import { Node } from '../../../domain/Node';
import { Like } from '../../../domain/relations/Like';
import { Dislike } from '../../../domain/relations/Dislike';
import driver from '../Config';

export class MatchingRepository implements IMatchingRepository {
    private driver: Driver;

    constructor() {
        this.driver = driver;
    }

    async create(entity: Node): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                'CREATE (u:User {userId: $userId, age: $age, location: $location, maxDistance: $maxDistance, gender: $gender, relationshipType: $relationshipType, genderPriority: $genderPriority})',
                {
                    userId: entity.userId,
                    age: entity.age,
                    location: entity.location.toString(),
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
                    location: entity.location.toString(),
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
                    userNode.location,
                    userNode.maxDistance,
                    userNode.gender,
                    userNode.relationshipType,
                    userNode.genderPriority
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
