import {IRepository} from "@/core/shared/application/IRepository";
import { Profile } from "../../domain/Profile";
import { StatisticsDTO } from "../DTO/StatisticsDTO";

export interface IProfileRepository extends IRepository<Profile> {
    findByUserId(userId: string): Promise<Profile | undefined>;
    getStatistics(): Promise<StatisticsDTO[]>;
}