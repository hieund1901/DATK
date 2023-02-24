import {Request} from "express";

export type Credentials = {
    userId: string;
    account: string;
    authId: string;
}

export interface AuthRequest extends Request {
    credentials?: Credentials,
    image?: any,
    file?: any
}