import {NextFunction, Request, Response} from "express";
import {BadRequestError, ServerError} from '../common/error'
import {failureResponse, Payload, serverErrorResponse} from '../common/responses';
import * as appStatus from '../common/const/appStatus';
import {logger} from "../utils/logger";

export const handleAPIError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        if (err instanceof ServerError) {
            const {status, message, data, appStatus} = err;
            const payload = new Payload({data, appStatus, message})
            if (status === 200) return failureResponse(res, payload);
            return serverErrorResponse(res, status, payload);
        }
        logger.error('[ERROR]', err);
        return serverErrorResponse(res, 500, new Payload({
            message: 'Internal Server Error',
            appStatus: appStatus.UNDEFINED_ERROR
        }));
    }
    return next();
}

export const handleNotFoundError = (req: Request, res: Response, next: NextFunction) => {
    serverErrorResponse(res, 404, new Payload({
        message: `Endpoint ${req.method} ${req.url} not found`,
        appStatus: appStatus.UNDEFINED_ERROR
    }));
    return next();
}

export const fileErrorHandler = (err, req, res, next) => {
    if (err) {
        throw new BadRequestError({message: 'Upload file error', appStatus: appStatus.UPLOAD_FILE_ERROR});
    }
    return next();
}
