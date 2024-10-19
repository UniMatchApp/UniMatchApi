import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { DeletePhotoFromTheWallDTO } from "../DTO/DeletePhotoFromTheWallDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { IFileHandler } from "@/core/shared/application/IFileHandler";

export class DeletePhotoFromTheWallCommand implements ICommand<DeletePhotoFromTheWallDTO, void> {
    private repository: IProfileRepository;
    private fileHandler: IFileHandler;

    constructor(repository: IProfileRepository, fileHandler: IFileHandler) {
        this.repository = repository;
        this.fileHandler = fileHandler;

    }

    async run(request: DeletePhotoFromTheWallDTO): Promise<Result<void>> {
        try {
            const profile = await this.repository.findById(request.id)
            if (!profile) {
                throw new Error(`Profile with id ${request.id} not found`);
            }

            if (!profile.wall.includes(request.photoURL)) {
                throw new Error(`Photo with url ${request.photoURL} not found`);
            }

            await this.fileHandler.delete(request.photoURL);


            profile.deletePost(request.photoURL);
            await this.repository.save(profile);

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}