const CreatePlayers = `
CREATE TABLE IF NOT EXISTS players(
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    tank BOOLEAN DEFAULT false NOT NULL,
    dps BOOLEAN DEFAULT false NOT NULL,
    healer BOOLEAN DEFAULT false NOT NULL,
    locked BOOLEAN DEFAULT false NOT NULL,
    in_the_roll BOOLEAN DEFAULT false NOT NULL,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);`

module.exports.generateSql = () => `${CreatePlayers}`