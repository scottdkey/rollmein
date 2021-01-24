const CreateUsers = `
CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR (255) UNIQUE,
    username VARCHAR (50) UNIQUE,
    password VARCHAR,
    google_auth VARCHAR (255),
    apple_auth VARCHAR (255),
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    last_login TIMESTAMP DEFAULT null
);`

module.exports.generateSql = () => `${CreateUsers}`