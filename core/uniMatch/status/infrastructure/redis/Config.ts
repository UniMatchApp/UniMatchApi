import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config({ path: 'status.env' });

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisUsername = process.env.REDIS_USERNAME || '';
const redisPassword = process.env.REDIS_PASSWORD || '';

const client = createClient({
    url: redisUrl,
    username: redisUsername,
    password: redisPassword,
});

client.connect().catch(err => {
    console.error('Error connecting to Redis', err);
});

export default client;
