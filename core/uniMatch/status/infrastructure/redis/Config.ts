import { createClient } from 'redis';

const client = createClient({ url: 'redis://localhost:6379' });

client.connect().catch(err => {
    console.error('Error connecting to Redis', err);
});

export default client;
