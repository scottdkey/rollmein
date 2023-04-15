import { addToContainer } from "../container";
import pino, { Logger } from "pino"
import dotenv from "dotenv"
import { DateService } from "../common/date/date.service";
dotenv.config()


@addToContainer()
export class LoggerService {
    private readonly prod: boolean
    constructor(private date: DateService) {
        this.prod = process.env.NODE_ENV === 'production'
    }
    timestamp(): string {
        return this.date.now().toISOString()
    }

    getLogger(context: string): Logger {
        return pino({
            name: context,
            level: this.prod ? "warn": "debug",
            prettifier: require('pino-pretty')
        })
    }
}