import { playerTable } from "../models/player"

module.exports.generateSql = () => {
  `CREATE TABLE IF NOT EXISTS ${playerTable}(
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(255) NOT NULL,
  tank BOOLEAN DEFAULT false NOT NULL,
  dps BOOLEAN DEFAULT false NOT NULL,
  healer BOOLEAN DEFAULT false NOT NULL,
  locked BOOLEAN DEFAULT false NOT NULL,
  in_the_roll BOOLEAN DEFAULT false NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() ON UPDATE now() NOT NULL,
);`}