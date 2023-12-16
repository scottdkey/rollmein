export function RedisConfig(): { host: string } {
  return {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
  };
}
