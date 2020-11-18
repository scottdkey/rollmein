const CreateUserOptions = `CREATE TABLE IF NOT EXISTS options(
    id SERIAL PRIMARY KEY,
    roll_type VARCHAR(40) DEFAULT 'freeForAll' NOT NULL,
    lock_after_out BOOLEAN DEFAULT false NOT NULL,
    theme VARCHAR (20) DEFAULT 'dark' NOT NULL,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE
);`

module.exports.generateSql = () => `${CreateUserOptions}`