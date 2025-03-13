
export interface IServiceExceptionOptions {
    message: string;
    traceId: string|null
    payload?: unknown;
    additionalInfo?: Record<string, unknown> | null;
    statusCode:number
}

export class ServiceException extends Error {
    message: string;
    traceId: string | null;
    additionalInfo?: Record<string, unknown> | null;
    payload: unknown;
    statusCode: number;

    constructor({  message, additionalInfo, payload, traceId, statusCode }: IServiceExceptionOptions) {
        super(message ?? "unknown error exception");
        this.message=message;
        this.traceId = traceId;
        this.statusCode = statusCode ?? 500;
        this.name = "ServiceException";
        this.payload = payload;
        this.additionalInfo = additionalInfo;
        // Capture the stack trace for debugging purposes
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
