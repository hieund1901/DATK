import {Router} from 'express';
import {BadRequestError} from '../../common/error';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyRefreshTokenMiddleware, verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import {verifySignature} from "../../middlewares/signatureMiddlewares";
import authService from '../../services/auth.service';
import asyncHandler from '../../utils/asyncHandler';
import {RegisterRequest} from "../../common/request_body/register";

const authMobileRouter = Router();

authMobileRouter.post(
    '/login',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        const {emailOrAccount, password} = req.body;
        if (!emailOrAccount || !password) throw new BadRequestError();
        const data = await authService.login({emailOrAccount, password});
        const {token, refreshToken, ...response} = data;
        const responseData = new ResponseData({result: data});
        return successResponse(res, responseData);
    })
);

authMobileRouter.post(
    '/register',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        /*  #swagger.parameters['body'] = {
                in: 'body',
                schema: {
                    name: '',
                    email: '',
                    password: '',
                    dateOfBirth: '',
                    gender: ''
                 }
        } */
        const registerRequest: RegisterRequest = new RegisterRequest(req.body);
        if (!registerRequest.email || !registerRequest.password) throw new BadRequestError();
        const data = await authService.verifyByGmail(registerRequest);
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    })
);

authMobileRouter.get(
    "/active",
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        const _id = req.query._id;
        const data = await authService.active(_id);
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    })
);

authMobileRouter.get(
    '/logout',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        // TODO: clear token REDIS
        const credentials = req.credentials;
        if (credentials) {
            const userId = credentials.userId;
            const authId = credentials.authId;
            await authService.logout({userId, authId});
        }
        const responseData = new ResponseData({})
        return successResponse(res, responseData);
    })
)

authMobileRouter.post(
    '/refresh-token',
    verifyRefreshTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        const {userId, authId} = req.credentials!;
        const accessToken = await authService.refreshToken({userId, authId});
        const responseData = new ResponseData({result: {token: accessToken, refreshToken: req.body.refreshToken}});
        return successResponse(res, responseData);
    })
)

authMobileRouter.post(
    "/changePassword",
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        const credentials = req.credentials;
        if (credentials) {
            const userId = credentials?.userId;
            const {password, newPassword} = req.body;
            const data = await authService.changePassword({userId, password, newPassword});
            const responseData = new ResponseData({result: data});
            return successResponse(res, responseData);
        }
        throw new BadRequestError();
    })
);

authMobileRouter.post(
    "/forgetPassword",
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        const {email} = req.body;
        const data = await authService.forgetPassword({email});
        const responseData = new ResponseData({result: data});
        return successResponse(res, responseData);
    })
);
authMobileRouter.post(
    "/setPassword",
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        const {_id, password} = req.body;
        const data = await authService.setPassword({_id, password});
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    })
)

authMobileRouter.get(
    '/logout-all',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth Mobile']
        // TODO: clear token REDIS
        const credentials = req.credentials;
        if (credentials) {
            const userId = credentials.userId;
            await authService.logOutAll({userId});
        }
        const responseData = new ResponseData({})
        return successResponse(res, responseData);
    })
)

export default authMobileRouter;
