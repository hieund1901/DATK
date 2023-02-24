import crypto from 'crypto';
import jwt, {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken';
import {UnauthorizedError} from '../common/error';
import {Credentials} from "../common/requests";
import * as appStatus from '../common/const/appStatus';

const fs = require('fs')
const path = require('path')

/**
 *
 * @param {{
 *  type?: 'accessToken' | 'refreshToken'
 *  credentials: { userId: string, role?: string, userName?: string }
 * }} args
 * @returns
 */
export function signCredentials(args: {
    type?: "accessToken" | "refreshToken",
    credentials: Credentials, metadata?: object
}) {
    const {credentials, type = 'accessToken'} = args;
    const secret = type === 'accessToken' ? fs.readFileSync(path.join(__dirname, 'key', 'access_token.private.key'), 'utf8') : fs.readFileSync(path.join(__dirname, 'key', 'refresh_token.private.key'), 'utf8');
    const expiresIn = type === 'accessToken' ? 600 : 60 * 60 * 24 * 7;
    const nonce = crypto.randomBytes(6).toString('hex');
    return jwt.sign({nonce, ...credentials, ...args.metadata}, secret, {algorithm: 'RS256', expiresIn});
}

export function verifyCredentials(args: {
    type?: 'accessToken' | 'refreshToken';
    token: string
}) {
    try {
        const {token, type = 'accessToken'} = args;
        const secret = type === 'accessToken' ? fs.readFileSync(path.join(__dirname, 'key', 'access_token.public.key'), 'utf8') : fs.readFileSync(path.join(__dirname, 'key', 'refresh_token.public.key'), 'utf8');
        const credentials: Credentials = jwt.verify(token, secret);
        return credentials;
    } catch (e) {
        if (e instanceof JsonWebTokenError) {
            if (e instanceof TokenExpiredError) {
                throw new UnauthorizedError({message: 'Token Expired', data: {}, appStatus: appStatus.TOKEN_EXPIRED});
            }
            throw new UnauthorizedError();
        }
        throw e;
    }
}