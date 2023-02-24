import {Router} from 'express';
import {BadRequestError} from '../common/error';
import {ResponseData, successResponse} from '../common/responses';
import authService from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import {verifyRefreshTokenMiddleware, verifyTokenMiddleware} from "../middlewares/authMiddlewares";

const authRouter = Router();

//API authen and generate token
authRouter.post(
    '',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth']

        const {emailOrAccount, password} = req.body;
        if (!emailOrAccount || !password) throw new BadRequestError();
        const data = await authService.auth({emailOrAccount, password});
        const {authId, userId, email} = data;
        const responseData = new ResponseData({result: {authId, userId, email}})
        return successResponse(res, responseData);
    })
);

//API get token
authRouter.get(
    '',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth']
        const authId = String(req.query.authId);
        const userId = String(req.query.userId);
        const data = await authService.getTokenWithAuthId({userId, authId});
        const {accessToken, refreshToken} = data;
        const responseData = new ResponseData({result: {accessToken, refreshToken}});
        return successResponse(res, responseData);
    })
)

authRouter.get(
    '/logout',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth']
        if (req.query.authId && req.query.userId) {
            const userId = String(req.query.userId);
            const authId = String(req.query.authId);
            await authService.logout({userId, authId});
        }
        const responseData = new ResponseData({})
        return successResponse(res, responseData);
    })
)

authRouter.post(
    '/refresh-token',
    verifyRefreshTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth']
        const {userId, authId} = req.credentials!;
        const accessToken = await authService.refreshToken({userId, authId});
        const responseData = new ResponseData({result: {accessToken, refreshToken: req.body.refreshToken}});
        return successResponse(res, responseData);
    })
)

authRouter.get(
    '/logout-all',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth']
        // TODO: clear token REDIS
        const credentials = req.credentials;
        if (credentials) {
            const userId = credentials.userId;
            await authService.logOutAll({userId});
        }
        res.clearCookie('x-access-token');
        res.clearCookie('x-refresh-token');
        return successResponse(res);
    })
)

export default authRouter;