import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { UUID } from "../../../../shared/domain/UUID";
import { DeleteAllNotificationsDTO } from "../DTO/DeleteAllNotificationsDTO";
import { INotificationsRepository } from "../ports/INotificationsRepository";

export class DeleteAllNotificationsCommand implements ICommand<DeleteAllNotificationsDTO, void> {
    private readonly repository: INotificationsRepository;

    run(request: DeleteAllNotificationsDTO): Result<void> {
         
       try {
            const recipientUserId = UUID.fromString(request.recipientUserId);
        
            this.repository.deleteAllNotificationsByRecipient(recipientUserId);

            return Result.success<void>(undefined);
            
        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}