import { IUserRepository } from "../../../application/ports/IUserRepository";
import AppDataSource from '../Config';
import { UserMapper } from "../mappers/UserMapper";
import { UserEntity } from "../models/UserEntity";
import { User } from "../../../domain/User";

export class UserRepository implements IUserRepository {

    private readonly userRepository = AppDataSource.getRepository(UserEntity);

    async create(entity: User): Promise<void> {
        const userEntity = UserMapper.toEntity(entity);
        await this.userRepository.save(userEntity);
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.userRepository.findOne({ where: { id } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<User[]> {
        const entities = await this.userRepository.find();
        return entities.map(UserMapper.toDomain);
    }

    async deleteById(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async deleteAll(): Promise<void> {
        await this.userRepository.clear();
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.userRepository.count({ where: { id } });
        return count > 0;
    }

    async update(entity: User, id: string): Promise<User> {
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('User not found');
        }

        const updatedEntity = UserMapper.toEntity(entity);
        updatedEntity.id = id;
        await this.userRepository.save(updatedEntity);
        return UserMapper.toDomain(updatedEntity);
    }

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.userRepository.findOne({ where: { email } });
        return entity ? UserMapper.toDomain(entity) : null;
    }
}