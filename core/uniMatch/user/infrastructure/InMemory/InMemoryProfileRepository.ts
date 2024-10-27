import { IProfileRepository } from "@/core/uniMatch/user/application/ports/IProfileRepository";
import { Profile } from "@/core/uniMatch/user/domain/Profile";

export class InMemoryProfileRepository implements IProfileRepository {
    private profiles: { [id: string]: Profile } = {};

    async create(entity: Profile): Promise<void> {
        const id = entity.getId().toString();
        this.profiles[id] = entity;
    }

    async deleteAll(): Promise<void> {
        this.profiles = {};
    }

    async deleteById(id: string): Promise<void> {
        if (!this.profiles[id]) {
            throw new Error(`Profile with ID ${id} does not exist.`);
        }
        delete this.profiles[id];
    }

    async existsById(id: string): Promise<boolean> {
        return id in this.profiles;
    }

    async findAll(): Promise<Profile[]> {
        return Object.values(this.profiles);
    }

    async findById(id: string): Promise<Profile | null> {
        return this.profiles[id] || null;
    }

    async findByUserId(userId: string): Promise<Profile | undefined> {
        return Object.values(this.profiles).find(profile => profile.userId === userId);
    }

    async update(entity: Profile, id: string): Promise<Profile> {
        if (!this.profiles[id]) {
            throw new Error(`Profile with ID ${id} does not exist.`);
        }
        this.profiles[id] = entity;
        return entity;
    }
}
