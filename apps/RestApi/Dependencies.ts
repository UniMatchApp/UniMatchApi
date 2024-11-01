import {InMemoryEventBus} from "@/core/shared/infrastructure/InMemoryEventBus";
import {TypeORMUserRepository} from "@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMUserRepository";
import {WebSocketController} from "@/apps/RestApi/WS/WebSocketsController";
import {
    RedisSessionStatusRepository
} from "@/core/uniMatch/status/infrastructure/redis/repositories/RedisSessionStatusRepository";
import {WebSocketsClientHandler} from "@/apps/RestApi/WS/WebSocketsClientHandler";

export const eventBus = new InMemoryEventBus();
export const wsClientHandler = new WebSocketsClientHandler();
const sessionStatusRepository = new RedisSessionStatusRepository();

new WebSocketController(8080, sessionStatusRepository, wsClientHandler);
