import {IProfileRepository} from "../../../application/ports/IProfileRepository";
import {Profile} from "../../../domain/Profile";
import {ProfileMapper} from "../mappers/ProfileMapper";
import {ProfileEntity} from "../models/ProfileEntity";
import AppDataSource from '../Config';
import {Repository} from "typeorm";

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
}