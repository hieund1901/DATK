import {NextFunction, RequestHandler, Response} from "express";
import {AuthRequest} from "../common/requests";

type AsyncRequestHandler = (req: AuthRequest, res: Response, next?: NextFunction) => Promise<any>;

export default function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
    return (req, res, next) => fn(req, res, next).catch(next);
}