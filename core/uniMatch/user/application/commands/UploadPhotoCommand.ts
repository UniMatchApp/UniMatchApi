import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {UploadPhotoDTO} from "../DTO/UploadPhotoDTO";
import {IProfileRepository} from "../ports/IProfileRepository";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {NullPointerError} from "@/core/shared/exceptions/NullPointerError";
import { UUID } from "@/core/shared/domain/UUID";


export class UploadPhotoCommand implements ICommand<UploadPhotoDTO, string> {
    private repository: IProfileRepository;
    private fileHandler: IFileHandler;

    constructor(repository: IProfileRepository, fileHandler: IFileHandler) {
        this.repository = repository;
        this.fileHandler = fileHandler;
    }

    async run(request: UploadPhotoDTO): Promise<Result<string>> {
        try {
            const photo = request.attachment;
            
            const photoUrl= await this.fileHandler.save(UUID.generate().toString(), photo);
            
            if (!photoUrl) {
                return Result.failure<string>(new NullPointerError(`Photo url is null`));
            }

            const profile = await this.repository.findByUserId(request.userId)
            if (!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.userId} not found`));
            }

            profile.addPost(photoUrl);
            await this.repository.update(profile, profile.getId());

            return Result.success<string>(photoUrl);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}