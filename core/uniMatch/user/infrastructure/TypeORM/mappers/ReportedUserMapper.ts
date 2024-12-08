import { ReportedUsersEntity } from "../models/ReportedUsersEntity";
import { TransformFromUndefinedToNull } from "@/core/shared/infrastructure/decorators/TransformFromUndefinedToNull";
import { ReportedUser } from "../../../domain/ReportedUser";

export class ReportedUserMapper {
    static toDomain(entity: ReportedUsersEntity): ReportedUser {
        const reportedUser = new ReportedUser(
            entity.userId,
            entity.predefinedReason,
            entity.comment
        );
        reportedUser.setId(entity.id);
        return reportedUser;
    }

    @TransformFromUndefinedToNull
    static toEntity(reportedUser: ReportedUser): ReportedUsersEntity {
        const entity = new ReportedUsersEntity();
        entity.id = reportedUser.getId();
        entity.userId = reportedUser.userId;
        entity.predefinedReason = reportedUser.predefinedReason;
        entity.comment = reportedUser.comment || "";
        return entity;
    }
}