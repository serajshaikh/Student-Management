export interface ILogger {
    info(payload: any, meta?: { description?: string; trace_id?: string; ref?: string }): void;
    error(payload: any, meta?: { description?: string; trace_id?: string; ref?: string }): void;
    debug(payload: any, meta?: { description?: string; trace_id?: string; ref?: string }): void;
    warn(payload: any, meta?: { description?: string; trace_id?: string; ref?: string }): void;
}
