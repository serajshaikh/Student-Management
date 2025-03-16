
import { IResponseHandler } from "../../interfaces/IResponseHandler";
import { z } from "zod";
import { IResponseModelFailureParams, IResponseModelSuccessParams } from "../../interfaces/IHttpResponseUtil";
import { inject, injectable } from "inversify";
import _ from "lodash";
import { IServiceExceptionOptions } from "./ServiceException";
import { TYPES } from "../../di/Types";
import { ILogger } from "../../interfaces/ILogger";

@injectable()
export class ResponseHandler implements IResponseHandler {
    constructor(@inject(TYPES.Logger) private logger: ILogger) { }
    validate<T>(arg: { schema: z.ZodType, suppress_error?: boolean, payload: T }, trace_id?: string): T {
        try {
            return arg.schema.parse(arg.payload);
        } catch (error) {
            this.logger.info({}, { description: "Payload Validation Error", trace_id, ref: "ResponseHandler:IResponseHandler" });
            throw error;
        }
    }

    success<T>(arg: IResponseModelSuccessParams<T>, trace_id?: string): void {
        console.log("Success---->", arg?.responseData, trace_id);
        this.logger.info({}, { description: "Request Success---->", trace_id, ref: "ResponseHandler:IResponseHandler" });
        arg.response.status(arg?.statusCode ?? 200).json(arg?.responseData ?? {});
    }

    failure(arg: IResponseModelFailureParams, trace_id?: string): void {
        console.log("Failure---->", JSON.stringify(arg.error), trace_id ?? "No Trace ID");
        this.logger.info({}, { description: "Request Failed---->", trace_id, ref: "ResponseHandler:IResponseHandler" });
        const { error, statusCode, response } = arg;
        const sanitizedError = _.omit(error ?? {}, ["statusCode"]);
        (sanitizedError as any).trace_id = trace_id;
        const status = (error as IServiceExceptionOptions)?.statusCode ?? statusCode ?? 500;
        response.status(status).json({ error: _.isEmpty(sanitizedError) ? { message: "Internal Server Error" } : sanitizedError });
    }
}