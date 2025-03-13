import { z } from "zod";
import { IResponseModelFailureParams, IResponseModelSuccessParams } from "./IHttpResponseUtil";


export interface IResponseHandler {
    version?: string;
    validate<T>(arg: { schema: z.ZodType, suppressError?: boolean, payload: T }, traceId?:string): T;
    success<T>(arg: IResponseModelSuccessParams<T>, traceId?:string): void;
    failure(arg: IResponseModelFailureParams, traceId?:string): void;
}