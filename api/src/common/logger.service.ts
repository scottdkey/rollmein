import { addToContainer } from "../container";
import winston from 'winston'
import { DateService } from "./date.service";
const { transports } = winston

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
    constructor(private date: DateService) { }
    timestamp(): string {
        return this.date.now().toISOString()
    }

    getLogger(context: string): Logger {
        const logger = winston.createLogger({
            format: winston.format.json(),
            transports: [new transports.Console(), new transports.File({ filename: './log/error.json', level: 'error', format: winston.format.json() }), new transports.File({ filename: './log/combined.json', format: winston.format.json() })]
        })
        return {
            info: (message: MessageType) => {
                logger.info( {context, ...message, timestamp: this.timestamp() })
            },
            debug: (message: MessageType) => {
                logger.debug({ context, ...message, timestamp: this.timestamp() })
            },
            warn: (message: MessageType) => {
                logger.warn({ context, ...message, timestamp: this.timestamp() })
            },
            error: (message: MessageType) => {
                logger.error({ context, ...message, timestamp: this.timestamp() })
            }

        }
    }
}