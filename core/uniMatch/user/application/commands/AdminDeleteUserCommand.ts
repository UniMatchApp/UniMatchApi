import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { DeleteUserDTO } from "../DTO/DeleteUserDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { AuthenticationError } from "@/core/shared/exceptions/AuthenticationError";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";

export class AdminDeleteUserCommand implements ICommand<DeleteUserDTO, void> {
    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;
    private readonly profileRepository: IProfileRepository;

    constructor(
        repository: IUserRepository, 
        profileRepository: IProfileRepository, 
        eventBus: IEventBus
    ) {
        this.repository = repository;
        this.profileRepository = profileRepository;
        this.eventBus = eventBus;
    }

    async run(request: DeleteUserDTO): Promise<Result<void>> {
        try {
            if (!request.targetId) {
                return Result.failure<void>(new NotFoundError(`Target user id not provided`));
            }

            // 1. Get the admin user to check if they are an admin
            const adminUser = await this.repository.findById(request.userId);
            if (!adminUser) {
                return Result.failure<void>(new NotFoundError(`Admin with id ${request.userId} not found`));
            }
            
            // 2. Ensure the admin has admin privileges
            if (!adminUser.administrator) {
                return Result.failure<void>(new AuthenticationError(`User with id ${request.userId} is not an admin`));
            }

            // 3. Get the target user to delete
            const targetUser = await this.repository.findById(request.targetId);
            if (!targetUser) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.userId} not found`));
            }

            // 4. Ensure the target user is not an admin
            if (targetUser.administrator) {
                return Result.failure<void>(new ValidationError(`Cannot delete admin user with id ${request.userId}`));
            }

            // 5. Perform the deletion of the user
            await this.repository.deleteById(request.targetId);

            const profile = await this.profileRepository.findByUserId(request.targetId);
            if (profile) {
                await this.profileRepository.deleteById(profile.getId().toString());
            }

            // Publish any domain events if necessary
            this.eventBus.publish(targetUser.pullDomainEvents());

            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
