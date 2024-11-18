import {ICommand} from "@/core/shared/application/ICommand";
import {ChangeRelationshipTypeDTO} from "../DTO/ChangeRelationshipTypeDTO";
import {Result} from "@/core/shared/domain/Result";
import {IProfileRepository} from "../ports/IProfileRepository";
import {IEventBus} from "@/core/shared/application/IEventBus";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {RelationshipType} from "@/core/shared/domain/RelationshipType";

export class ChangeRelationshipTypeCommand implements ICommand<ChangeRelationshipTypeDTO, string> {
    private readonly repository: IProfileRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IProfileRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangeRelationshipTypeDTO): Promise<Result<string>> {
        try {

            const profile = await this.repository.findById(request.id);

            if (!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            profile.relationshipType = RelationshipType.fromString(request.relationshipType);

            await this.repository.update(profile, profile.getId());
            this.eventBus.publish(profile.pullDomainEvents());
            return Result.success<string>(request.relationshipType);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}