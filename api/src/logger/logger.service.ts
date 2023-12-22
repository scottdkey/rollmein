import { addToContainer } from "../container.js";
import pino, { Logger } from "pino";
import dotenv from "dotenv";
import { DateService } from "../date/date.service.js";
dotenv.config();

@addToContainer()
export class LoggerService {
  private readonly prod: boolean;
  constructor(private date: DateService) {
    this.prod = process.env.NODE_ENV === "production";
  }
  timestamp(): string {
    return this.date.now().toISOString();
  }

  getLogger(context: string): Logger {
    return pino({
      name: context,
      level: this.prod ? "trace" : "info",
    });
  }
}
