import {Node} from "@/core/uniMatch/matching/domain/Node";
import {user1, user2, user3, user4, user5} from "@/core/uniMatch/user/domain/MockUsers";
import {Location} from "@/core/shared/domain/Location";
import {Gender} from "@/core/shared/domain/Gender";
import {RelationshipType} from "@/core/shared/domain/RelationshipType";

export const mockNode1 = new Node(
    user1.getId(), 30, new Location(50, 50),
    300, Gender.fromString("FEMALE"),
    RelationshipType.fromString("FRIENDSHIP"),
    Gender.fromString("FEMALE"));
export const mockNode2 = new Node(
    user2.getId(), 30, new Location(50, 50),
    300, Gender.fromString("FEMALE"),
    RelationshipType.fromString("CASUAL"),
    Gender.fromString("MALE"));
export const mockNode3 = new Node(
    user3.getId(), 30, new Location(50, 50),
    300, Gender.fromString("MALE"),
    RelationshipType.fromString("CASUAL"),
    Gender.fromString("MALE"));
export const mockNode4 = new Node(
    user4.getId(), 30, new Location(50, 50),
    300, Gender.fromString("MALE"),
    RelationshipType.fromString("LONG-TERM"),
    Gender.fromString("FEMALE"));
export const mockNode5 = new Node(
    user5.getId(), 30, new Location(50, 50),
    300, Gender.fromString("MALE"),
    RelationshipType.fromString("FRIENDSHIP"),
    Gender.fromString("FEMALE"));