import {IRepository} from "@/core/shared/application/IRepository";
import { User } from "../../domain/User";

export interface IUserRepository extends IRepository<User> {
    
}