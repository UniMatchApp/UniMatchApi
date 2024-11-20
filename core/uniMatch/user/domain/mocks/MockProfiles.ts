import {Profile} from "@/core/uniMatch/user/domain/Profile";

import {user1, user2, user3, user4, user5} from "@/core/uniMatch/user/domain/mocks/MockUsers";
import {SexualOrientation} from "@/core/uniMatch/user/domain/SexualOrientation";
import {RelationshipType} from "@/core/shared/domain/RelationshipType";
import {Location} from "@/core/shared/domain/Location";
import {Gender} from "@/core/shared/domain/Gender";

export const mockProfile1 = new Profile(
    user1.getId(),
    "User 1",
    31,
    "About user 1",
    new Gender("FEMALE"),
    new SexualOrientation("HETEROSEXUAL"),
    new RelationshipType("CASUAL"),
    new Date('1990-01-01'),
    ["reading", "traveling"],
    ["Post 1", "Post 2"],
    new Location(28.123456, -15.123456)
);

export const mockProfile2 = new Profile(
    user2.getId(),
    "User 2",
    21,
    "About user 2",
    new Gender("MALE"),
    new SexualOrientation("HETEROSEXUAL"),
    new RelationshipType("CASUAL"),
    new Date('1990-01-01'),
    ["reading", "traveling"],
    ["Post 1", "Post 2"],
    new Location(28.123456, -15.123456)
);


export const mockProfile3 = new Profile(
    user3.getId(),
    "User 3",
    19,
    "About user 3",
    new Gender("FEMALE"),
    new SexualOrientation("HETEROSEXUAL"),
    new RelationshipType("CASUAL"),
    new Date('1999-01-01'),
    ["reading", "traveling"],
    ["Post 1", "Post 2"],
    new Location(28.123456, -15.123456),
);

export const mockProfile4 = new Profile(
    user4.getId(),
    "User 4",
    18,
    "About user 4",
    new Gender("FEMALE"),
    new SexualOrientation("HETEROSEXUAL"),
    new RelationshipType("CASUAL"),
    new Date('1994-01-01'),
    ["reading", "traveling"],
    ["Post 1", "Post 2"],
    new Location(28.123456, -15.123456),
);


export const mockProfile5 = new Profile(
    user5.getId(),
    "User 5",
    22,
    "About user 5",
    new Gender("MALE"),
    new SexualOrientation("HETEROSEXUAL"),
    new RelationshipType("LONG_TERM"),
    new Date('2009-01-01'),
    ["reading", "traveling"],
    ["Post 1", "Post 2"],
    new Location(28.123456, -15.123456),
);

