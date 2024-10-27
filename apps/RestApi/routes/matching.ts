import { Router } from 'express';
import { MatchingController } from '../uniMatch/matching/MatchingController';
import { Neo4JMatchingRepository } from '@/core/uniMatch/matching/infrastructure/neo4j/repositories/Neo4JMatchingRepository';
import { eventBus } from '../Dependencies';
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {InMemoryMatchingRepository} from "@/core/uniMatch/matching/infrastructure/InMemory/InMemoryMatchingRepository";

const router = Router();

const matchingRepository:IMatchingRepository = new Neo4JMatchingRepository();
const matchingController = new MatchingController(matchingRepository, eventBus);

router.post('/matching/dislike/:userId', matchingController.userDislikedSomebody.bind(matchingController));
router.post('/matching/like/:userId', matchingController.userLikedSomebody.bind(matchingController));

export { router };
