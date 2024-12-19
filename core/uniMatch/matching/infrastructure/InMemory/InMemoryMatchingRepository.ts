import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {Dislike} from "@/core/uniMatch/matching/domain/relations/Dislike";
import {Like} from "@/core/uniMatch/matching/domain/relations/Like";
import {Node} from "@/core/uniMatch/matching/domain/Node";
import {mockNode1, mockNode2, mockNode3, mockNode4, mockNode5} from "../../domain/MockNodes";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";


export class InMemoryMatchingRepository implements IMatchingRepository {
    private nodes: { [id: string]: Node } = {
        [mockNode1.userId]: mockNode1,
        [mockNode2.userId]: mockNode2,
        [mockNode3.userId]: mockNode3,
        [mockNode4.userId]: mockNode4,
        [mockNode5.userId]: mockNode5,
    };

    // People that like userId
    private likes: { [userId: string]: Like[] } = {
        [mockNode1.userId]: [new Like(mockNode2, mockNode1), new Like(mockNode3, mockNode1), new Like(mockNode4, mockNode1)],
        [mockNode2.userId]: [new Like(mockNode1, mockNode2), new Like(mockNode3, mockNode2)],
        [mockNode3.userId]: [new Like(mockNode2, mockNode3), new Like(mockNode1, mockNode3), new Like(mockNode4, mockNode3)],
        [mockNode4.userId]: [new Like(mockNode2, mockNode4), new Like(mockNode3, mockNode4), new Like(mockNode1, mockNode4)],
        [mockNode5.userId]: [new Like(mockNode2, mockNode5), new Like(mockNode3, mockNode5), new Like(mockNode4, mockNode5)],
        
    };

    // People that dislike userId
    private dislikes: { [userId: string]: Dislike[] } = {};


    constructor() {
        console.log("InMemoryMatchingRepository created with nodes", this.nodes);
    }
    deleteByUserId(userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // async findPotentialMatches(userId: string, limit: number): Promise<Node[]> {
    //     const user = this.nodes[userId];
    //     if (!user) {
    //         throw new Error(`User with ID ${userId} does not exist.`);
    //     }
    
    //     const potentialMatches = Object.values(this.nodes)
    //         .filter(node => node.userId !== userId)
    //         .filter(node => (user.genderPriority && node.gender === user.genderPriority))
    //         .filter(node =>
    //             !this.dislikes[userId]?.some(dislike => dislike.toProfile.userId === node.userId) &&
    //             !this.likes[userId]?.some(like => like.toProfile.userId === node.userId)
    //         )
    //         .map(node => {
    //             const isWithinDistance = user.location && node.location
    //                 ? this.isWithinDistance(user.location, node.location, user.maxDistance)
    //                 : true;
    
    //             const priority = 
    //                 (isWithinDistance ? 1 : 0) +
    //                 (node.relationshipType === user.relationshipType ? 1 : 0);
    
    //             return { node, priority };
    //         })
    //         .sort((a, b) => b.priority - a.priority)
    //         .slice(0, limit)
    //         .map(item => item.node);
    
    //     return potentialMatches;
    // }

    async findPotentialMatches(userId: string, limit: number): Promise<Node[]> {
        const user = this.nodes[userId];
        if (!user) {
            throw new Error(`User with ID ${userId} does not exist.`);
        }

        const potentialMatches = Object.values(this.nodes)
            .filter(node => {
                const isDifferentUser = node.userId !== userId;
                return isDifferentUser;
            })
            .filter(node => {
                const matchesGenderPriority = user.genderPriority || node.gender === user.genderPriority;
                return matchesGenderPriority;
            })
            .filter(node => {
                const isNotDisliked = !this.dislikes[userId]?.some(dislike => dislike.toProfile.userId === node.userId);
                const isNotLiked = !this.likes[userId]?.some(like => like.toProfile.userId === node.userId);
                return isNotDisliked && isNotLiked;
            })
            .map(node => {
                const isWithinDistance = user.location && node.location
                    ? this.isWithinDistance(user.location, node.location, user.maxDistance)
                    : true;

                const priority = 
                    (isWithinDistance ? 1 : 0) +
                    (node.relationshipType === user.relationshipType ? 1 : 0);
                    (node.age >= user.ageRange[0] && node.age <= user.ageRange[1] ? 1 : 0);
                return { node, priority };
            })
            .sort((a, b) => {
                return b.priority - a.priority;
            })
            .slice(0, limit)
            .map(item => {
                return item.node;
            });
    
        return potentialMatches;
    }
    
    

    async findMutualLikes(userId: string): Promise<Node[]> {
        const user = this.nodes[userId];
        if (!user) {
            throw new NotFoundError(`User with ID ${userId} does not exist.`);
        }

        const usersThatUserLikes = await this.findUsersThatUserLikes(userId);
        const usersThatLikeUser = this.likes[userId] || [];

        const mutualLikes = usersThatUserLikes.filter(
            user => usersThatLikeUser.some(
                like => like.fromProfile.userId === user.userId
            )
        );
        return mutualLikes;
    }


    private isWithinDistance(location1: { longitude: number; latitude: number }, location2: {
        longitude: number;
        latitude: number
    }, maxDistance: number): boolean {
        const distance = Math.sqrt(
            Math.pow(location1.latitude - location2.latitude, 2) +
            Math.pow(location1.longitude - location2.longitude, 2)
        );
        return distance <= maxDistance;
    }

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

    async findUsersThatLikeUser(userId: string): Promise<Node[]> {
        return this.likes[userId].map(like => like.fromProfile);
    }

    private async findUsersThatUserLikes(userId: string): Promise<Node[]> {
        const usersThatUserLikes: Node[] = [];
        for (const userLikes of Object.values(this.likes)) {
            for (const like of userLikes) {
                if (like.fromProfile.userId === userId) {
                    usersThatUserLikes.push(like.toProfile);
                }
            }
        }
        return usersThatUserLikes;
    }
}
