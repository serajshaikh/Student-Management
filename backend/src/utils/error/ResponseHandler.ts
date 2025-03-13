
import { IResponseHandler } from "../../interfaces/IResponseHandler";
import { z } from "zod";
import { IResponseModelFailureParams, IResponseModelSuccessParams } from "../../interfaces/IHttpResponseUtil";
import { injectable } from "inversify";
import _ from "lodash";
import { IServiceExceptionOptions } from "./ServiceException";

@injectable()
export class ResponseHandler implements IResponseHandler {

    validate<T>(arg: { schema: z.ZodType, suppress_error?: boolean, payload: T }, traceId?:string): T {
        try {
            return arg.schema.parse(arg.payload);
        } catch (error) {
            console.log("Payload Validation Error-->", traceId);
            throw error;
        }
    }

    success<T>(arg: IResponseModelSuccessParams<T>, traceId?:string): void {
        console.log("Success---->", arg?.responseData, traceId);
        arg.response.status(arg?.statusCode ?? 200).json(arg?.responseData ?? {});
    }

    failure(arg: IResponseModelFailureParams, traceId?:string): void {
        console.log("Failure---->", JSON.stringify(arg?.error), traceId);
        const errorResponse = _.omit(arg?.error??{}, ["statusCode"]);
        const status = (arg?.error as IServiceExceptionOptions)?.statusCode ?? arg?.statusCode ?? 500;
        arg.response.status(status).json({error:errorResponse ?? {}});
    }
}