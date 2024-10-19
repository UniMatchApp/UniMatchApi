import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UploadPhotoDTO } from "../DTO/UploadPhotoDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { IFileHandler } from "@/core/shared/application/IFileHandler";


export class UploadPhotoCommand implements ICommand<UploadPhotoDTO, File> {
    private repository: IProfileRepository;
    private fileHandler: IFileHandler;

    constructor(repository: IProfileRepository, fileHandler: IFileHandler) {
        this.repository = repository;
        this.fileHandler = fileHandler;
    }

    async run(request: UploadPhotoDTO): Promise<Result<File>> {
        try {

            const photo = request.photo;

            if (photo) {
                return Result.failure<File>("Invalid file.");
            }

            const fileName = request.photo?.name;
            if (!fileName) {
                return Result.failure<File>("Invalid file name.");
            }

            let photoUrl: string | undefined = undefined;

            if (photo) {
                photoUrl = await this.fileHandler.save(fileName, photo);
            }
            
            if(!photoUrl) {
                throw new Error("Photo url is undefined");
            }

            const profile = await this.repository.findById(request.userId)
            if (!profile) {
                throw new Error(`Profile with id ${request.userId} not found`);
            }
            
            profile.addPost(photoUrl);
            await this.repository.save(profile);

            return Result.success<File>(photo);
        } catch (error : any) {
            return Result.failure<File>(error);
        }
    }
}