import {IRepository} from "@/core/shared/application/IRepository";
import { ReportedUser } from "../../domain/ReportedUser";
import { ReportUserDTO } from "../DTO/ReportUserDTO";

export interface IReportedUserRepository extends IRepository<ReportedUser> {
    findByUserId(userId: string): Promise<ReportedUser | undefined>;
    getReportsByUserId(userId: string): Promise<ReportedUser[]>;
}
