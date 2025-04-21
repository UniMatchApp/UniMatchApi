// MatchingRepository.ts
import {Driver} from 'neo4j-driver';
import neo4j from 'neo4j-driver';
import { IMatchingRepository } from '../../../application/ports/IMatchingRepository';
import { Node } from '../../../domain/Node';
import { Like } from '../../../domain/relations/Like';
import { Dislike } from '../../../domain/relations/Dislike';
import driver from '../Config';
import { Location } from '@/core/shared/domain/Location';
import { Gender } from '@/core/shared/domain/Gender';
import { RelationshipType } from '@/core/shared/domain/RelationshipType';
import { NodeMapper } from '../mappers/NodeMapper';

export class Neo4JMatchingRepository implements IMatchingRepository {
    private driver: Driver;

    constructor() {
        this.driver = driver;
        driver.verifyConnectivity()
            .then(() => {
                console.log('Data Source has been initialized for Neo4j!');
            })
            .catch((err) => {
                console.error('Error during Data Source initialization for Neo4j', err);
            });

        console.log("Neo4JMatchingRepository::constructor() -> Neo4j driver created")
    }

    async getTotalMatchesNumber(): Promise<number> {
        const session = this.driver.session();
    
        try {
            const result = await session.run('MATCH ()-[r]->() RETURN count(r) as total');
            const record = result.records[0];
            return record.get('total').toInt();
        } finally {
            await session.close();
        }
    }

    async findUsersThatLikeUser(userId: string): Promise<Node[]> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                'MATCH (u1:User)-[:LIKES]->(u2:User {userId: $userId}) RETURN u1',
                { userId }
            );
            return result.records.map((record: any): Node => {
                const userNode: any = record.get('u1').properties
                return NodeMapper.toDomain(userNode);
            });
        } finally {
            await session.close();
        }
    }

    async findPotentialMatches(userId: string, limit: number): Promise<Node[]> {
        const session = this.driver.session();
    
        try {
            console.log(`🔍 Iniciando búsqueda de potenciales matches para el usuario: ${userId}`);
    
            // Primero obtenemos los datos del usuario u1
            const userDataResult = await session.run(
                `MATCH (u:User {userId: $userId}) RETURN u`,
                { userId }
            );
    
            if (userDataResult.records.length === 0) {
                console.warn(`⚠️ No se encontró el usuario con userId: ${userId}`);
                return [];
            }
    
            const u1 = userDataResult.records[0].get('u').properties;
            console.log('🧾 Datos del usuario u1:', {
                age: u1.age,
                ageRange: u1.ageRange,
                genderPriority: u1.genderPriority,
                relationshipType: u1.relationshipType,
                lookingRandom: u1.lookingRandom,
                latitude: u1.latitude,
                longitude: u1.longitude,
                maxDistance: u1.maxDistance
            });
    
            // Luego ejecutamos la búsqueda de potenciales matches
            const result = await session.run(
                `
                MATCH (u1:User {userId: $userId})
                MATCH (u2:User)
                WHERE u2.userId <> $userId
                    AND (
                        (u1.lookingRandom = true AND u2.lookingRandom = true) OR
                        (u1.lookingRandom = true AND u2.lookingRandom = false) OR
                        (u1.lookingRandom = false AND u2.lookingRandom = true) OR
                        (u1.lookingRandom = false AND u2.lookingRandom = false)
                    )
                    AND (u1.genderPriority IS NULL OR u2.gender = u1.genderPriority)
                    AND NOT (u1)-[:DISLIKES]->(u2)
                    AND NOT (u1)-[:LIKES]->(u2)
                WITH u1, u2,
                    (CASE
                        WHEN u1.longitude IS NULL OR u2.longitude IS NULL THEN 1
                        WHEN u2.age >= u1.ageRange[0] AND u2.age <= u1.ageRange[1] THEN 1
                        WHEN u1.maxDistance = 0 OR point.distance(
                            point({longitude: u1.longitude, latitude: u1.latitude}),
                            point({longitude: u2.longitude, latitude: u2.latitude})
                        ) <= u1.maxDistance * 1000 THEN 1 
                        ELSE 0 
                     END +
                     CASE WHEN u2.relationshipType = u1.relationshipType THEN 1 ELSE 0 END) AS priority
                ORDER BY priority DESC
                LIMIT $sanitizedLimit
                RETURN u2, priority
                `,
                { userId, sanitizedLimit: neo4j.Integer.fromNumber(limit) }
            );
    
            console.log(`🔎 Número de candidatos encontrados: ${result.records.length}`);
    
            if (result.records.length === 0) {
                console.warn('⚠️ No se encontraron candidatos. Revisa condiciones o datos del usuario.');
            }
    
            result.records.forEach((record: any, i: number) => {
                const userNode = record.get('u2').properties;
                const priority = record.get('priority');
                console.log(`🧪 Candidato ${i + 1}:`, {
                    userId: userNode.userId,
                    age: userNode.age,
                    gender: userNode.gender,
                    latitude: userNode.latitude,
                    longitude: userNode.longitude,
                    relationshipType: userNode.relationshipType,
                    priority: priority.toInt?.() ?? priority
                });
            });
    
            return result.records.map((record: any): Node => {
                const userNode: any = record.get('u2').properties;
                return NodeMapper.toDomain(userNode);
            });
        } catch (error) {
            console.error('❌ Error fetching potential matches from Neo4j:', error);
            throw error;
        } finally {
            await session.close();
        }
    }
    

    async findRandomPotentialMatch(userId: string): Promise<Node[]> {
        return this.findPotentialMatches(userId, 1);
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
                const userNode = record.get('u2').properties;
                return NodeMapper.toDomain(userNode);
            });
        } finally {
            await session.close();
        }
    }
    
    async create(entity: Node): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                `CREATE (u:User {
                    entityId: $id,
                    userId: $userId,
                    age: $age,
                    ageRange: $ageRange,
                    latitude: $latitude,
                    longitude: $longitude,
                    maxDistance: $maxDistance,
                    gender: $gender,
                    relationshipType: $relationshipType,
                    genderPriority: $genderPriority,
                    lookingRandom: $lookingRandom
                })`,
                {
                    id: entity.getId(),
                    userId: entity.userId,
                    age: entity.age,
                    ageRange: entity.ageRange,
                    latitude: entity.location?.latitude ?? null,
                    longitude: entity.location?.longitude ?? null,
                    maxDistance: entity.maxDistance,
                    gender: entity.gender.toString(),
                    relationshipType: entity.relationshipType.toString(),
                    genderPriority: entity.genderPriority?.toString() ?? null,
                    lookingRandom: entity.lookingRandom ?? false
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
                `MATCH (u:User {entityId: $id})
                 SET u.age = $age,
                     u.latitude = $latitude,
                     u.longitude = $longitude,
                     u.ageRange = $ageRange,
                     u.maxDistance = $maxDistance,
                     u.gender = $gender,
                     u.relationshipType = $relationshipType,
                     u.genderPriority = $genderPriority,
                     u.lookingRandom = $lookingRandom`,
                {
                    id,
                    age: entity.age,
                    ageRange: entity.ageRange,
                    latitude: entity.location?.latitude ?? null,
                    longitude: entity.location?.longitude ?? null,
                    maxDistance: entity.maxDistance,
                    gender: entity.gender.toString(),
                    relationshipType: entity.relationshipType.toString(),
                    genderPriority: entity.genderPriority?.toString() ?? null,
                    lookingRandom: entity.lookingRandom ?? false
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
                'MATCH (u:User {entityId: $id}) RETURN u',
                { id: id } 
            );

            const record = result.records[0];
            if (record) {
                const userNode = record.get('u').properties;
                return NodeMapper.toDomain(userNode);
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
                const userNode = record.get('u').properties;
                return NodeMapper.toDomain(userNode);
            });
        } finally {
            await session.close();
        }
    }

    async deleteById(id: string): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                'MATCH (u:User {entityId: $id}) DELETE u',
                { id: id }
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

    async deleteByUserId(userId: string): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                'MATCH (n {userId: $userId}) DETACH DELETE n',
                { userId }
            );
        } finally {
            await session.close();
        }
    }

    async existsById(id: string): Promise<boolean> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                'MATCH (u:User {entityId: $id}) RETURN COUNT(u) AS count',
                { id: id }
            );
            return result.records[0].get('count').toNumber() > 0;
        } finally {
            await session.close();
        }
    }

    async findByUserId(userId: string): Promise<Node | undefined> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                'MATCH (u:User {userId: $userId}) RETURN u',
                { userId }
            );
            const record = result.records[0];
            if (!record) {
                return undefined;
            }
            const userNode = record.get('u').properties;
            return NodeMapper.toDomain(userNode);
        } finally {
            await session.close();
        }
    }

    async likeUser(like: Like): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                'MATCH (u1:User {entityId: $fromUserId}), (u2:User {entityId: $toUserId}) ' +
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
                'MATCH (u1:User {entityId: $fromUserId}), (u2:User {entityId: $toUserId}) ' +
                'CREATE (u1)-[:DISLIKES]->(u2)',
                { fromUserId: dislike.fromProfile.getId(), toUserId: dislike.toProfile.getId() }
            );
        } finally {
            await session.close();
        }
    }
}
