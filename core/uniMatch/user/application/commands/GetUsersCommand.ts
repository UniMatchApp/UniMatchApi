import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IProfileRepository} from "../ports/IProfileRepository";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {GetProfileDTO} from "../DTO/GetProfileDTO";
import {ProfileDTO} from "@/core/uniMatch/user/application/DTO/ProfileDTO";
import { UserDTO } from "../DTO/UserDTO";
import { IUserRepository } from "../ports/IUserRepository";

export class GetUsersCommand implements ICommand<void, UserDTO[]> {
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(request: any): Promise<Result<UserDTO[]>> {
        try {
            const users = await this.repository.findAll();

            const userDTOs: UserDTO[] = users.map(user => {
                return UserDTO.mapProfileToUserDTO(user);
            });

            return Result.success<UserDTO[]>(userDTOs);
        } catch (error: any) {
            return Result.failure<UserDTO[]>(error);
        }
    }
}
