import { addToContainer } from "../container";
import winston from 'winston'
const { format, transports } = winston
const { combine, label, printf, timestamp, prettyPrint } = format

export interface MessageType {
    [key: string]: any
}

export enum LogType {
    INFO = 'info',
    DEBUG = 'debug',
    WARN = 'warn',
    ERROR = 'error'
}
interface ParamsType {
    [key: string]: any
}

export interface Logger {
    info: (message: string, params?: ParamsType) => void;
    debug: (message: string, params?: ParamsType) => void;
    warn: (message: string, params?: ParamsType) => void;
    error: (message: string, params?: ParamsType) => void;
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
            info: (message: string, params?: ParamsType) => {
                logger.info({
                    level: LogType.INFO,
                    message,
                    params
                })
            },
            debug: (message: string, params?: ParamsType) => {
                logger.debug({
                    level: LogType.DEBUG,
                    message,
                    params
                })
            },
            warn: (message: string, params?: ParamsType) => {
                logger.warn({
                    level: LogType.WARN,
                    message,
                    params
                })
            },
            error: (message: string, params?: ParamsType) => {
                logger.error({
                    level: LogType.ERROR,
                    message,
                    params
                })
            }

        }
    }
}