import { User } from "../../../domain/User";
import { UserEntity } from "../models/UserEntity";

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        return new User(
            entity.registrationDate,
            entity.email,
            entity.password,
            entity.blockedUsers
        );
    }

    static toEntity(user: User): UserEntity {
        const entity = new UserEntity();
        entity.code = user.code;
        entity.registrationDate = user.registrationDate;
        entity.email = user.email;
        entity.password = user.password;
        entity.blockedUsers = user.blockedUsers;
        entity.reportedUsers = user.reportedUsers;
        return entity;
    }
}