// Create instances of User
import {User} from "@/core/uniMatch/user/domain/User";

export const user1 = new User(new Date('2023-01-01'), 'user1@alu.ulpgc.es', 'Password');
user1.setId("d449400b-1716-4474-b8aa-2d058542270c");
user1.code = "123456";
user1.registered = true;
export const user2 = new User(new Date('2023-02-01'), 'user2@alu.ulpgc.es', 'Password');
export const user3 = new User(new Date('2023-03-01'), 'user3@alu.ulpgc.es', 'Password');
export const user4 = new User(new Date('2023-04-01'), 'user4@alu.ulpgc.es', 'Password');
export const user5 = new User(new Date('2023-05-01'), 'user5@alu.ulpgc.es', 'Password');