import { userOptionsTable } from "../models/userOptions"

module.exports.generateSql = () => {
  `CREATE TABLE IF NOT EXSITS ${userOptionsTable} (
  id SERIAL PRIMARY KEY,
  roll_type VARCHAR(40) DEFAULT freeForAll NOT NULL,
  lock_after_out BOOLEAN DEFAULT false NOT NULL,
  theme VARCHAR (20) DEFAULT dark NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL
);`}