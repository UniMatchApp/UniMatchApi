import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {Dislike} from "@/core/uniMatch/matching/domain/relations/Dislike";
import {Like} from "@/core/uniMatch/matching/domain/relations/Like";
import {Node} from "@/core/uniMatch/matching/domain/Node";

export class InMemoryMatchingRepository implements IMatchingRepository {
    private nodes: { [id: string]: Node } = {};
    private likes: { [userId: string]: Like[] } = {};
    private dislikes: { [userId: string]: Dislike[] } = {};

    async create(node: Node): Promise<void> {
        const id = node.getId().toString();
        this.nodes[id] = node;
    }

    async deleteAll(): Promise<void> {
        this.nodes = {};
        this.likes = {};
        this.dislikes = {};
    }

    async deleteById(id: string): Promise<void> {
        if (!this.nodes[id]) {
            throw new Error(`Node with ID ${id} does not exist.`);
        }
        delete this.nodes[id];
        delete this.likes[id];
        delete this.dislikes[id];
    }

    async dislikeUser(dislike: Dislike): Promise<void> {
        const userId = dislike.toProfile.userId;
        if (!this.dislikes[userId]) {
            this.dislikes[userId] = [];
        }
        this.dislikes[userId].push(dislike);
    }

    async existsById(id: string): Promise<boolean> {
        return id in this.nodes;
    }

    async findAll(): Promise<Node[]> {
        return Object.values(this.nodes);
    }

    async findById(id: string): Promise<Node | null> {
        return this.nodes[id] || null;
    }

    async findByUserId(userId: string): Promise<Node | undefined> {
        return Object.values(this.nodes).find(node => node.userId === userId);
    }

    async likeUser(like: Like): Promise<void> {
        const userId = like.toProfile.userId;
        if (!this.likes[userId]) {
            this.likes[userId] = [];
        }
        this.likes[userId].push(like);
    }

    async update(node: Node, id: string): Promise<Node> {
        if (!this.nodes[id]) {
            throw new Error(`Node with ID ${id} does not exist.`);
        }
        this.nodes[id] = node;
        return node;
    }
}
