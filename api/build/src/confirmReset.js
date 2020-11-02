"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_confirm_1 = __importDefault(require("prompt-confirm"));
const prompt = new prompt_confirm_1.default("Doing this will destroy the production database. Are you sure you would like to continue? Y/N");
const child_process_1 = require("child_process");
async function sh(cmd) {
    return new Promise((resolve, reject) => {
        child_process_1.exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({ stdout, stderr });
            }
        });
    });
}
prompt.ask(async (answer) => {
    if (answer === false) {
        console.log("exiting");
    }
    else {
        let { stdout } = await sh('npm run prod_sql');
        for (let line of stdout.split('\n')) {
            console.log(line);
        }
    }
});
