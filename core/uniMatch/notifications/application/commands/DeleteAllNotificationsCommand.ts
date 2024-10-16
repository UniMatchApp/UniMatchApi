import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UUID } from "@/core/shared/domain/UUID";
import { DeleteAllNotificationsDTO } from "../DTO/DeleteAllNotificationsDTO";
import { INotificationsRepository } from "../ports/INotificationsRepository";

export class DeleteAllNotificationsCommand implements ICommand<DeleteAllNotificationsDTO, void> {
    private readonly repository: INotificationsRepository;


    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    run(request: DeleteAllNotificationsDTO): Result<void> {
         
       try {
            const recipientUserId = UUID.fromString(request.user);
        
            this.repository.deleteAllNotificationsByRecipient(recipientUserId);

            return Result.success<void>(undefined);
            
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}