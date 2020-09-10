// import Confirm from "prompt-confirm";
import dotenv from "dotenv"
import { exec } from "child_process";

dotenv.config()
const { NODE_ENV } = process.env;
const dbName = process.env[NODE_ENV];

async function sh(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

const resetDatabase = async (environment, dbName) => {
  console.log(`Resetting ${environment} database`);
  let { stdout } = await sh(`psql && DROP DATABASE IF EXISTS ${dbName} && CREATE DATABASE ${dbName}`);
  for (let line of stdout.split("\n")) {
    console.log(line);
  }
};

console.log(NODE_ENV, dbName);
resetDatabase(NODE_ENV, dbName);
