import {IRepository} from "@/core/shared/application/IRepository";
import { Profile } from "../../domain/Profile";

export interface IProfileRepository extends IRepository<Profile> {
}