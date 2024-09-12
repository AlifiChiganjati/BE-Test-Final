const redis = require("redis");
const { Client } = require("redis-om");

const redisClient = redis.createClient({ url: "redis://localhost:6379" });

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

(async () => {
  await redisClient.connect();
})();

const redisOmClient = new Client().use(redisClient);

module.exports = { redisClient, redisOmClient };
