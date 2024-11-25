import {Node} from "@/core/uniMatch/matching/domain/Node";
import {user1, user2, user3, user4, user5} from "@/core/uniMatch/user/domain/mocks/MockUsers";
import {Location} from "@/core/shared/domain/Location";
import {Gender} from "@/core/shared/domain/Gender";
import {RelationshipType} from "@/core/shared/domain/RelationshipType";

export const mockNode1 = new Node(
    user1.getId(), 30,
    [18, 100],
    300, new Gender("FEMALE"),
    new RelationshipType("FRIENDSHIP"),
    new Gender("FEMALE"))
    new Location(50, 50);
export const mockNode2 = new Node(
    user2.getId(), 30,
    [18, 100],
    300, new Gender("FEMALE"),
    new RelationshipType("CASUAL"),
    new Gender("MALE"))
    new Location(50, 50);
export const mockNode3 = new Node(
    user3.getId(), 30,
    [18, 100],
    300, new Gender("MALE"),
    new RelationshipType("CASUAL"),
    new Gender("MALE"))
export const mockNode4 = new Node(
    user4.getId(), 30,
    [18, 100],
    300, new Gender("MALE"),
    new RelationshipType("LONG_TERM"),
    new Gender("FEMALE"))
    new Location(50, 50);
export const mockNode5 = new Node(
    user5.getId(), 30,
    [18, 100],
    300, new Gender("MALE"),
    new RelationshipType("FRIENDSHIP"),
    new Gender("FEMALE"));