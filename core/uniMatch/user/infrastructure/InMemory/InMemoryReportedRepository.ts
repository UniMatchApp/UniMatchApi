import { ReportUserDTO } from "../../application/DTO/ReportUserDTO";
import { IReportedUserRepository } from "../../application/ports/IReportedUserRepository";
import { ReportedUser } from "../../domain/ReportedUser";


export class InMemoryReportedRepository implements IReportedUserRepository {

    private reports: Map<string, ReportedUser> = new Map();

    async findByUserId(userId: string): Promise<ReportedUser | undefined> {
        return Array.from(this.reports.values()).find(report => report.userId === userId);
    }

    async getReportsByUserId(userId: string): Promise<ReportedUser[]> {
        return Array.from(this.reports.values())
            .filter(report => report.userId === userId)
    }

    async getReports(): Promise<ReportedUser[]> {
        return Array.from(this.reports.values());
    }

    async create(entity: ReportedUser): Promise<void> {
        this.reports.set(entity.userId, entity);
    }

    async update(entity: ReportedUser, id: string): Promise<ReportedUser> {
        if (!this.reports.has(id)) {
            throw new Error("Reported user not found");
        }
        this.reports.set(id, entity);
        return entity;
    }

    async findById(id: string): Promise<ReportedUser | null> {
        return this.reports.get(id) || null;
    }

    async findAll(): Promise<ReportedUser[]> {
        return Array.from(this.reports.values());
    }

    async deleteById(id: string): Promise<void> {
        this.reports.delete(id);
    }

    async deleteAll(): Promise<void> {
        this.reports.clear();
    }

    async existsById(id: string): Promise<boolean> {
        return this.reports.has(id);
    }

    private toDTO(report: ReportedUser): ReportUserDTO {
        return {
            id: report.getId().toString(),
            reportedUserId: report.userId,
            predefinedReason: report.predefinedReason,
            details: report.details,
            comment: report.comment,
            createdAt: report.timestamp, 
        } satisfies ReportUserDTO;
    }
}