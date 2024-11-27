import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { UserEntity } from './models/UserEntity';
import { ProfileEntity } from './models/ProfileEntity';
import { ReportedUsersEntity } from './models/ReportedUsersEntity';

const envFilePath = path.resolve(__dirname, 'user.env');
dotenv.config({ path: envFilePath });

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.USER_DB_HOST ?? 'localhost',
    port: parseInt(process.env.USER_DB_PORT ?? '3306', 10),
    username: process.env.USER_DB_USERNAME ?? 'test',
    password: process.env.USER_DB_PASSWORD ?? 'test',
    database: process.env.USER_DB_NAME ?? 'test',
    entities: [UserEntity, ProfileEntity, ReportedUsersEntity],
    synchronize: false
});


export default AppDataSource;
