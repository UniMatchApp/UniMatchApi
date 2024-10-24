import { ICommand } from "@/core/shared/application/ICommand";
import { GetAllNotificationsDTO } from "../DTO/GetAllNotificationsDTO";
import { Notification } from "../../domain/Notification";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Result } from "@/core/shared/domain/Result";

export class GetAllNotificationsCommand implements ICommand<GetAllNotificationsDTO, Notification[]> {

    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    async run(request: GetAllNotificationsDTO): Promise<Result<Notification[]>> {
        try {
            const notifications = await this.repository.getAllNotifications(request.userId);
            return Result.success<Notification[]>(notifications);
        } catch (error : any) {
            return Result.failure<Notification[]>(error);
        }
    }
}