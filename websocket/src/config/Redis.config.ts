export function RedisConfig(): { host: string; port: number } {
  return {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  };
}
