
export interface IServiceExceptionOptions {
    message: string;
    trace_id?: string
    payload?: unknown;
    additionalInfo?: Record<string, unknown> | null;
    statusCode:number
}

export class ServiceException extends Error {
    message: string;
    trace_id?: string;
    additionalInfo?: Record<string, unknown> | null;
    payload: unknown;
    statusCode: number;

    constructor({  message, additionalInfo, payload, trace_id, statusCode }: IServiceExceptionOptions) {
        super(message ?? "unknown error exception");
        this.message=message;
        this.trace_id = trace_id;
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
