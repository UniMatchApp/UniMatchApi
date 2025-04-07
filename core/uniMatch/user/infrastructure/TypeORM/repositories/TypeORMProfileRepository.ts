import {IProfileRepository} from "../../../application/ports/IProfileRepository";
import {Profile} from "../../../domain/Profile";
import {ProfileMapper} from "../mappers/ProfileMapper";
import {ProfileEntity} from "../models/ProfileEntity";
import AppDataSource from '../Config';
import {Repository} from "typeorm";
import { StatisticsDTO } from "../../../application/DTO/StatisticsDTO";

export class TypeORMProfileRepository implements IProfileRepository {

    private readonly profileRepository: Repository<ProfileEntity>;

    constructor() {
        AppDataSource.initialize()
            .then(() => {
                console.log('Data Source has been initialized for User');
            })
            .catch((err) => {
                console.error('Error during Data Source initialization for User', err);
            });

        this.profileRepository = AppDataSource.getRepository(ProfileEntity);
    }

    async create(entity: Profile): Promise<void> {
        const profileEntity = ProfileMapper.toEntity(entity);
        await this.profileRepository.save(profileEntity);
    }

    async findById(id: string): Promise<Profile | null> {
        const entity = await this.profileRepository.findOne({where: {id}});
        return entity ? ProfileMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<Profile[]> {
        const entities = await this.profileRepository.find();
        return entities.map(ProfileMapper.toDomain);
    }

    async deleteById(id: string): Promise<void> {
        await this.profileRepository.delete(id);
    }

    async deleteAll(): Promise<void> {
        await this.profileRepository.clear();
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.profileRepository.count({where: {id}});
        return count > 0;
    }

    async update(entity: Profile, id: string): Promise<Profile> {
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('Profile not found');
        }

        const updatedEntity = ProfileMapper.toEntity(entity);
        updatedEntity.id = id;
        await this.profileRepository.save(updatedEntity);
        return entity;
    }

    async findByUserId(userId: string): Promise<Profile | undefined> {
        const entity = await this.profileRepository.findOne({where: {userId}});
        return entity ? ProfileMapper.toDomain(entity) : undefined;
    }

    async getGenderStatistics(): Promise<StatisticsDTO> {
        const genderStats = await this.profileRepository
            .createQueryBuilder('profile')
            .select('profile.gender', 'stat')
            .addSelect('COUNT(*)', 'total_users')
            .groupBy('profile.gender')
            .getRawMany();
    
        return {
            title: 'Users by Gender',
            columns: ['Gender', 'Users', 'Active'],
            stats: genderStats.map(row => ({
                stat: row.stat,
                total_users: parseInt(row.total_users),
                active_users: parseInt(row.total_users),
            })),
        };
    }
    
    async getRelationshipStatistics(): Promise<StatisticsDTO> {
        const relationshipStats = await this.profileRepository
            .createQueryBuilder('profile')
            .select('profile.relationshipType', 'stat')
            .addSelect('COUNT(*)', 'total_users')
            .groupBy('profile.relationshipType')
            .getRawMany();
    
        return {
            title: 'Users by Relationship Type',
            columns: ['Relationship Type', 'Users', 'Active'],
            stats: relationshipStats.map(row => ({
                stat: row.stat,
                total_users: parseInt(row.total_users),
                active_users: parseInt(row.total_users),
            })),
        };
    }
    
    async getOrientationStatistics(): Promise<StatisticsDTO> {
        const orientationStats = await this.profileRepository
            .createQueryBuilder('profile')
            .select('profile.sexualOrientation', 'stat')
            .addSelect('COUNT(*)', 'total_users')
            .groupBy('profile.sexualOrientation')
            .getRawMany();
    
        return {
            title: 'Users by Sexual Orientation',
            columns: ['Sexual Orientation', 'Users', 'Active'],
            stats: orientationStats.map(row => ({
                stat: row.stat,
                total_users: parseInt(row.total_users),
                active_users: parseInt(row.total_users),
            })),
        };
    }
    
    async getStatistics(): Promise<StatisticsDTO[]> {
        const [gender, relationship, orientation] = await Promise.all([
            this.getGenderStatistics(),
            this.getRelationshipStatistics(),
            this.getOrientationStatistics(),
        ]);
    
        return [gender, relationship, orientation];
    }
    
    

}