import {createClient} from "redis";

const redisClient = createClient({url: 'redis://103.226.249.176:6379'});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().then();


export default redisClient;
