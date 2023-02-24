import {ServerError, UnauthorizedError} from '../common/error';
import asyncHandler from '../utils/asyncHandler';
import {verifyCredentials} from '../utils/jwtHelper';
import * as appStatus from '../common/const/appStatus';
import redisClient from "../utils/redis";

export const verifyTokenMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // if (!authHeader) throw new UnauthorizedError();

    let token: string;
    if (authHeader) {
        const [tokenType, _token] = authHeader.split(' ');
        if (tokenType.toLocaleLowerCase() !== 'bearer' || !_token) throw new UnauthorizedError({
            message: 'Invalid Token',
            appStatus: appStatus.TOKEN_INVALID
        });
        token = _token;
    } else {
        const _token = req.cookies['x-access-token'];
        if (!_token) throw new UnauthorizedError({message: 'Invalid Token', appStatus: appStatus.TOKEN_INVALID});
        token = _token;
    }


    const credentials = verifyCredentials({token, type: 'accessToken'});
    if (!credentials) throw new UnauthorizedError({message: 'Invalid Token', appStatus: appStatus.TOKEN_INVALID});

    // TODO: REDIS
    const checkToken = await isTokenInBlacklist(credentials.authId)
    if (checkToken) {
        throw new UnauthorizedError({message: 'Invalid Token', appStatus: appStatus.TOKEN_INVALID})
    }
    // const savedToken = await authService.getAccessToken({ userId: credentials.userId, authId: credentials.authId });
    // if (!savedToken || savedToken !== token) throw new UnauthorizedError({ message: 'Invalid Token', appStatus:appStatus.TOKEN_INVALID  });
    req.credentials = credentials;
    return next!();
});

export const verifyRefreshTokenMiddleware = asyncHandler(async (req, res, next) => {
    // const authHeader = req.headers.authorization;
    // if (!authHeader) throw new UnauthorizedError();
    let token: string;
    if (req.body.refreshToken) {
        const _token = req.body.refreshToken;
        if (!_token) throw new UnauthorizedError({message: 'Invalid Token', appStatus: appStatus.TOKEN_INVALID});
        token = _token;
    } else {
        const _token = req.cookies['x-refresh-token'];
        if (!_token) throw new UnauthorizedError({message: 'Invalid Token', appStatus: appStatus.TOKEN_INVALID});
        token = _token;
    }

    const credentials = verifyCredentials({token, type: 'refreshToken'});
    if (!credentials) throw new UnauthorizedError({message: 'Invalid Token', appStatus: appStatus.TOKEN_INVALID});

    // TODO: REDIS
    // const savedToken = await authService.getRefreshToken({ userId: credentials.userId, authId: credentials.authId });
    // if (!savedToken || savedToken !== token) throw new UnauthorizedError({ message: 'Invalid Token', appStatus:appStatus.TOKEN_INVALID  });
    const checkToken = await isTokenInBlacklist(credentials.authId)
    if (checkToken) {
        throw new UnauthorizedError({message: 'Invalid Token', appStatus: appStatus.TOKEN_INVALID})
    }
    req.credentials = credentials;
    return next!();
});

const isTokenInBlacklist = async (authId: string) => {
    try {
        const data = await redisClient.get(`blacklist_${authId}`);
        return data !== null;
    } catch (e) {
        throw new ServerError({message: `Error when check token ${e}`});
    }
}