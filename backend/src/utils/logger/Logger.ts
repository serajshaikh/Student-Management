import winston from "winston";
import { injectable } from "inversify";
import { ILogger } from "../../interfaces/ILogger";
@injectable()
export class Logger implements ILogger {
    private logger = winston.createLogger({
        level: "info",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, metadata }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${metadata ? JSON.stringify(metadata) : ""}`;
            })
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: "app.log" })
        ]
    });

    private log(level: string, payload: any, meta?: { description?: string; trace_id?: string; ref?: string }) {
        const logData = {
            message: meta?.description || "Log message",
            payload,
            trace_id: meta?.trace_id,
            ref: meta?.ref
        };
        this.logger.log(level, logData.message, { metadata: logData });
    }

    info(payload: any, meta?: { description?: string; trace_id?: string; ref?: string }) {
        this.log("info", payload, meta);
    }

    error(payload: any, meta?: { description?: string; trace_id?: string; ref?: string }) {
        this.log("error", payload, meta);
    }

    debug(payload: any, meta?: { description?: string; trace_id?: string; ref?: string }) {
        this.log("debug", payload, meta);
    }

    warn(payload: any, meta?: { description?: string; trace_id?: string; ref?: string }) {
        this.log("warn", payload, meta);
    }
}
