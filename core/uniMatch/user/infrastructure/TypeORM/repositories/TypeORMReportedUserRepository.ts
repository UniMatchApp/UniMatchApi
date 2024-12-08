import { Repository } from "typeorm";
import { ReportedUsersEntity } from "../models/ReportedUsersEntity";
import { ReportedUser } from "../../../domain/ReportedUser";
import { IReportedUserRepository } from "../../../application/ports/IReportedUserRepository";
import { ReportedUserMapper } from "../mappers/ReportedUserMapper";
import AppDataSource from '../Config';

export class TypeORMReportedUserRepository implements IReportedUserRepository {
    private readonly reportedUserRepository: Repository<ReportedUsersEntity>;

    constructor() {
        AppDataSource.initialize()
            .then(() => {
                console.log('Data Source has been initialized for ReportedUser');
            })
            .catch((err) => {
                console.error('Error during Data Source initialization for ReportedUser', err);
            });

        this.reportedUserRepository = AppDataSource.getRepository(ReportedUsersEntity);
    }

    async create(entity: ReportedUser): Promise<void> {
        const reportedUserEntity = ReportedUserMapper.toEntity(entity);
        await this.reportedUserRepository.save(reportedUserEntity);
    }

    async findById(id: string): Promise<ReportedUser | null> {
        const entity = await this.reportedUserRepository.findOne({where: {id}});
        return entity ? ReportedUserMapper.toDomain(entity) : null;
    }
        
    async findAll(): Promise<ReportedUser[]> {
        const entities = await this.reportedUserRepository.find();
        return entities.map(ReportedUserMapper.toDomain);
    }

    async deleteById(id: string): Promise<void> {
        await this.reportedUserRepository.delete(id);
    }

    async deleteAll(): Promise<void> {
        await this.reportedUserRepository.clear();
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.reportedUserRepository.count({ where: { id } });
        return count > 0;
    }

    async update(entity: ReportedUser, id: string): Promise<ReportedUser> {
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('ReportedUser not found');
        }

        const updatedEntity = ReportedUserMapper.toEntity(entity);
        updatedEntity.id = id;
        await this.reportedUserRepository.save(updatedEntity);
        return ReportedUserMapper.toDomain(updatedEntity);
    }

    async findByUserId(userId: string): Promise<ReportedUser | undefined> {
        const entity = await this.reportedUserRepository.findOne({ where: { userId } });
        return entity ? ReportedUserMapper.toDomain(entity) : undefined;
    }
}