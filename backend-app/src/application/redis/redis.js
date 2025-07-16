import { createClient } from 'redis';
import 'dotenv/config';

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

await redisClient.connect();

export default redisClient;