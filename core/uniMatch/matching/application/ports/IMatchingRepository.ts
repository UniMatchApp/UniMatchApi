import {IRepository} from "@/core/shared/application/IRepository";
import { Node } from "../../domain/Node";

export interface IMatchingRepository extends IRepository<Node> {}