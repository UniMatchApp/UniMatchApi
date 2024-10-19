import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UploadPhotoDTO } from "../DTO/UploadPhotoDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";


export class UploadPhotoCommand implements ICommand<UploadPhotoDTO, File> {
    private repository: IProfileRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    constructor(repository: IProfileRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    run(request: UploadPhotoDTO): Result<File> {
        try {

            const photo = request.photo;

            if (photo && !this.fileHandler.isValid(photo)) {
                return Result.failure<File>("Invalid file.");
            }

            const fileName = request.photo?.name;
            if (!fileName) {
                return Result.failure<File>("Invalid file name.");
            }

            let photoUrl: string | undefined = undefined;

            if (photo) {
                photoUrl = this.fileHandler.save(fileName, photo);
            }
            
            if(!photoUrl) {
                throw new Error("Photo url is undefined");
            }

            const profile = this.repository.findById(request.userId)
            if (!profile) {
                throw new Error(`Profile with id ${request.userId} not found`);
            }
            
            profile.addPost(photoUrl);
            this.repository.save(profile);

            return Result.success<File>(photo);
        } catch (error : any) {
            return Result.failure<File>(error);
        }
    }
}