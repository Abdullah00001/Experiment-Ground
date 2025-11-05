"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const env_1 = require("../env");
const redisClient = new ioredis_1.Redis({
    host: env_1.env.REDIS_HOST,
    password: env_1.env.REDIS_PASSWORD,
    port: Number(env_1.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    lazyConnect: false,
});
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});
exports.default = redisClient;
