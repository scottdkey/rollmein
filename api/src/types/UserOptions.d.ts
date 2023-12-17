interface UserOptions {
  userId: string;
  theme: "light" | "dark";
  createdAt: string;
  updatedAt: string;
}

interface DbUserOptions {
  user_id: string;
  theme: "light" | "dark";
  created_at: string;
  updated_at: string;
}

interface UserOptionsInput {
  theme: "light" | "dark";
}
