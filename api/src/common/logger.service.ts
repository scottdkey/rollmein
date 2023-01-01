import { addToContainer } from "../container";
import pino from "pino"
import { DateService } from "./date.service";
import dotenv from "dotenv"


dotenv.config()
export interface MessageType {
    [key: string]: any
    message: string
}

export enum LogType {
    INFO = 'info',
    DEBUG = 'debug',
    WARN = 'warn',
    ERROR = 'error'
}

export interface Logger {
    info: (message: MessageType) => void;
    debug: (message: MessageType) => void;
    warn: (message: MessageType) => void;
    error: (message: MessageType) => void;
}


@addToContainer()
export class LoggerService {
    private prod: boolean
    constructor(private date: DateService) {
        this.prod = process.env.NODE_ENV === 'production'
    }
    timestamp(): string {
        return this.date.now().toISOString()
    }

    getLogger(context: string): Logger {
        const log = pino({
            name: context,
            level: this.prod ? "info" : "debug",
            prettifier: require('pino-pretty'),
        })
        return {
            info: (message: MessageType) => {
                log.info({ ...message, timestamp: this.timestamp() })
            },
            debug: (message: MessageType) => {
                log.debug({ ...message, timestamp: this.timestamp() })
            },
            warn: (message: MessageType) => {
                log.warn({ ...message, timestamp: this.timestamp() })
            },
            error: (message: MessageType) => {
                log.error({ ...message, timestamp: this.timestamp() })
            }

        }
    }
}