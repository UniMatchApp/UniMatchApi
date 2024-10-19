import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeMoreAboutMeDTO } from "../DTO/ChangeMoreAboutMeDTO";
import { Horoscope } from "../../domain/Horoscope";

export class ChangeHoroscopeCommand implements ICommand<ChangeMoreAboutMeDTO, string> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeMoreAboutMeDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.userId);
            if(!profile) {
                throw new Error('Profile not found');
            }

            const horoscope = new Horoscope(request.newContent);

            profile.horoscope = horoscope;
            await this.repository.save(profile);
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }

}