export interface PostgresConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export function PostgresConfig(): PostgresConfig {
  const {
    POSTGRES_DATABASE,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
  } = process.env;
  return {
    user: POSTGRES_USER as string,
    password: POSTGRES_PASSWORD as string,
    host: POSTGRES_HOST as string,
    port: parseInt(POSTGRES_PORT || "0"),
    database: POSTGRES_DATABASE as string,
  };
}
