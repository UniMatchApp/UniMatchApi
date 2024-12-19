import {IUserRepository} from "@/core/uniMatch/user/application/ports/IUserRepository";
import {User} from "@/core/uniMatch/user/domain/User";
import {user1, user2, user3, user4, user5} from "@/core/uniMatch/user/domain/mocks/MockUsers";

export class InMemoryUserRepository implements IUserRepository {
    private users: { [id: string]: User } = {
        [user1.getId().toString()]: user1,
        [user2.getId().toString()]: user2,
        [user3.getId().toString()]: user3,
        [user4.getId().toString()]: user4,
        [user5.getId().toString()]: user5,
    };

    constructor(){
        console.log("InMemoryUserRepository created! with users: ", this.users);
    }

    async create(entity: User): Promise<void> {
        const id = entity.getId().toString();
        this.users[id] = entity;
    }

    async deleteAll(): Promise<void> {
        this.users = {};
    }

    async deleteById(id: string): Promise<void> {
        if (!this.users[id]) {
            throw new Error(`User with ID ${id} does not exist.`);
        }
        delete this.users[id];
    }

    async existsById(id: string): Promise<boolean> {
        return id in this.users;
    }

    async findAll(): Promise<User[]> {
        return Object.values(this.users);
    }

    async findByEmail(email: string): Promise<User | null> {
        return Object.values(this.users).find(user => user.email === email) || null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users[id] || null;
    }

    async update(entity: User, id: string): Promise<User> {
        if (!this.users[id]) {
            throw new Error(`User with ID ${id} does not exist.`);
        }
        this.users[id] = entity;
        return entity;
    }
}
