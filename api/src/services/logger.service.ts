import { addToContainer } from "../container";
import winston from 'winston'
const { format, transports } = winston
const { combine, label, printf, timestamp, prettyPrint } = format

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

    myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });
    timestamp(): string {
        const now = new Date
        return now.toISOString()
    }

    private logMessage(message: MessageType, level: LogType) {
        return {
            level,
            message: JSON.stringify(message)
        }
    }



    getLogger(context: string): Logger {
        const logger = winston.createLogger({
            format: combine(
                label({ label: context }),
                timestamp(),
                prettyPrint(),
                this.myFormat,
            ),
            transports: [new transports.Console()]
        })
        return {
            info: (message: MessageType) => {
                logger.info(this.logMessage(message, LogType.INFO))
            },
            debug: (message: MessageType) => {
                logger.debug(this.logMessage(message, LogType.DEBUG))
            },
            warn: (message: MessageType) => {
                logger.warn(this.logMessage(message, LogType.WARN))
            },
            error: (message: MessageType) => {
                logger.error(this.logMessage(message, LogType.ERROR))
            }

        }
    }
}