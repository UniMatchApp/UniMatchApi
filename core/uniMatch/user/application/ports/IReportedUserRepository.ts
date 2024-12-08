import {IRepository} from "@/core/shared/application/IRepository";
import { ReportedUser } from "../../domain/ReportedUser";

export interface IReportedUserRepository extends IRepository<ReportedUser> {
    findByUserId(userId: string): Promise<ReportedUser | undefined>;
}