import {IRepository} from "@/core/shared/application/IRepository";
import { User } from "../../domain/User";
import { ReportUserDTO } from "../DTO/ReportUserDTO";

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}