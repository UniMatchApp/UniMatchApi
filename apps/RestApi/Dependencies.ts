import {InMemoryEventBus} from "@/core/shared/infrastructure/InMemoryEventBus";
import {TypeORMUserRepository} from "@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMUserRepository";
import {WebSocketSessionController} from "@/apps/RestApi/WS/WebSocketsSession";
import {
    RedisSessionStatusRepository
} from "@/core/uniMatch/status/infrastructure/redis/repositories/RedisSessionStatusRepository";

export const eventBus = new InMemoryEventBus();

new WebSocketSessionController(new RedisSessionStatusRepository());
