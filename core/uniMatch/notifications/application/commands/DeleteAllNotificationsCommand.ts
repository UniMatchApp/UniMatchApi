import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { DeleteAllNotificationsDTO } from "../DTO/DeleteAllNotificationsDTO";
import { INotificationsRepository } from "../ports/INotificationsRepository";

export class DeleteAllNotificationsCommand implements ICommand<DeleteAllNotificationsDTO, void> {
    private readonly repository: INotificationsRepository;


    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    async run(request: DeleteAllNotificationsDTO): Promise<Result<void>> {
         
       try {
        
            await this.repository.deleteAllNotificationsByRecipient(request.user);

            return Result.success<void>(undefined);
            
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}