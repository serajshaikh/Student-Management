import { Response } from "express";
import { IServiceExceptionOptions } from "../utils/error/ServiceException";

export interface IResponseModelSuccessParams<T> {
    responseData: T | null | { data: T, message: string };
    statusCode: number,
    response: Response,
}

export interface IResponseModelFailureParams extends Partial<IResponseModelSuccessParams<unknown>> {
    response: Response,
    error: IServiceExceptionOptions|Error| unknown
}