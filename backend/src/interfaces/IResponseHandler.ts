import { z } from "zod";
import { IResponseModelFailureParams, IResponseModelSuccessParams } from "./IHttpResponseUtil";


export interface IResponseHandler {
    version?: string;
    validate<T>(arg: { schema: z.ZodType, suppressError?: boolean, payload: T }, trace_id?:string): T;
    success<T>(arg: IResponseModelSuccessParams<T>, trace_id?:string): void;
    failure(arg: IResponseModelFailureParams, trace_id?:string): void;
}