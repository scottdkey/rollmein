import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config({ path: ".env.local" });

const base = () => {
  const supabaseRef = process.env.SUPABASE_REF;
  console.log("Generating types from Supabase");
  if (!supabaseRef) {
    throw new Error("SUPABASE_REF is not defined");
  }

  exec(
    `npx supabase gen types typescript --project-id ${supabaseRef} --schema public > types_db.ts `,
    // `npx supabase gen types typescript --project-id ${supabaseRef} --schema public > types_db.ts`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`${stderr}`);
        return;
      }
      console.log(`processed`);
    }
  );
};

base();
