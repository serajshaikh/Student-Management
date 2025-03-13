
import { IResponseHandler } from "../../interfaces/IResponseHandler";
import { z } from "zod";
import { IResponseModelFailureParams, IResponseModelSuccessParams } from "../../interfaces/IHttpResponseUtil";
import { injectable } from "inversify";
import _ from "lodash";
import { IServiceExceptionOptions } from "./ServiceException";

@injectable()
export class ResponseHandler implements IResponseHandler {

    validate<T>(arg: { schema: z.ZodType, suppress_error?: boolean, payload: T }, trace_id?: string): T {
        try {
            return arg.schema.parse(arg.payload);
        } catch (error) {
            console.log("Payload Validation Error-->", trace_id);
            throw error;
        }
    }

    success<T>(arg: IResponseModelSuccessParams<T>, trace_id?: string): void {
        console.log("Success---->", arg?.responseData, trace_id);
        arg.response.status(arg?.statusCode ?? 200).json(arg?.responseData ?? {});
    }

    failure(arg: IResponseModelFailureParams, trace_id?: string): void {
        console.log("Failure---->", JSON.stringify(arg.error), trace_id ?? "No Trace ID");

        const { error, statusCode, response } = arg;
        const sanitizedError = _.omit(error ?? {}, ["statusCode"]);
        const status = (error as IServiceExceptionOptions)?.statusCode ?? statusCode ?? 500;
        response.status(status).json({ error: _.isEmpty(sanitizedError) ? { message: "Internal Server Error" } : sanitizedError });
    }
}