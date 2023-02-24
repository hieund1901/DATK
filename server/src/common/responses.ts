import {Response} from "express";

export class Pagination {
    total: number;
    totalPage: number;
    page: number;
    pageSize: number;
    isPaging: boolean;
}

export class ResponseData {
    result: any;
    pagination: any;

    constructor(args: { result?: any; pagination?: Pagination; }) {
        this.result = args.result || {};
        this.pagination = args.pagination || {};
    }
}

export class Payload {
    data: any;
    appStatus: Number;
    message: string;

    constructor(args: { data?: ResponseData; appStatus?: Number; message?: string }) {
        this.data = args.data || {};
        this.appStatus = args.appStatus || -3;
        this.message = args.message || 'Error';
    }
}

export const successResponse = (res: Response, data?: ResponseData, appStatus?: Number) => {
    res.json({data: data || {}, appStatus: appStatus || 200});
}

export const failureResponse = (res: Response, payload: Payload) => {
    res.json(payload);
}
export const serverErrorResponse = (res: Response, status: number, payload: Payload) => {
    res.status(status).json(payload);
}