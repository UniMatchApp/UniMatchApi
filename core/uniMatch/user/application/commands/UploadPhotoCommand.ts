import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {UploadPhotoDTO} from "../DTO/UploadPhotoDTO";
import {IProfileRepository} from "../ports/IProfileRepository";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {FileError} from "@/core/shared/exceptions/FileError";
import {NullPointerError} from "@/core/shared/exceptions/NullPointerError";


export class UploadPhotoCommand implements ICommand<UploadPhotoDTO, File> {
    private repository: IProfileRepository;
    private fileHandler: IFileHandler;

    constructor(repository: IProfileRepository, fileHandler: IFileHandler) {
        this.repository = repository;
        this.fileHandler = fileHandler;
    }

    async run(request: UploadPhotoDTO): Promise<Result<File>> {
        try {
            const photo = request.attachment;
            const fileName = request.attachment?.name;

            if (!fileName) {
                return Result.failure<File>(new FileError(`Invalid file name`));
            }

            const photoUrl= await this.fileHandler.save(fileName, photo);

            if (!photoUrl) {
                return Result.failure<File>(new NullPointerError(`Photo url is null`));
            }

            const profile = await this.repository.findByUserId(request.userId)
            if (!profile) {
                return Result.failure<File>(new NotFoundError(`Profile with id ${request.userId} not found`));
            }

            profile.addPost(photoUrl);
            await this.repository.update(profile, profile.getId());

            return Result.success<File>(photo);
        } catch (error: any) {
            return Result.failure<File>(error);
        }
    }
}