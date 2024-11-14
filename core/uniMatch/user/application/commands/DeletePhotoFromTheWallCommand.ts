import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { DeletePhotoFromTheWallDTO } from "../DTO/DeletePhotoFromTheWallDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class DeletePhotoFromTheWallCommand implements ICommand<DeletePhotoFromTheWallDTO, void> {
    private repository: IProfileRepository;
    private fileHandler: IFileHandler;

    constructor(repository: IProfileRepository, fileHandler: IFileHandler) {
        this.repository = repository;
        this.fileHandler = fileHandler;

    }

    async run(request: DeletePhotoFromTheWallDTO): Promise<Result<void>> {
        try {
            const profile = await this.repository.findById(request.userId)
            if (!profile) {
                return Result.failure<void>(new NotFoundError(`Profile with id ${request.userId} not found`));
            }

            if (!profile.wall.includes(request.photoURL)) {
                return Result.failure<void>(new NotFoundError(`Photo with URL ${request.photoURL} not found`));
            }

            await this.fileHandler.delete(request.photoURL);
            profile.deletePost(request.photoURL);
            await this.repository.update(profile, profile.getId());

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}