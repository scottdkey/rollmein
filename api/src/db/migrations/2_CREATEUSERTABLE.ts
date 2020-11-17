import { userTable } from "../models/user"

const CreateUsers = `
CREATE TABLE IF NOT EXISTS ${userTable} (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR (255),
    username VARCHAR (50) UNIQUE,
    password VARCHAR,
    google_auth VARCHAR (255),
    apple_auth VARCHAR (255),
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    last_login TIMESTAMP DEFAULT null
);`

module.exports.generateSql = () => `${CreateUsers}`