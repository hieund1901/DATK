import {Router} from 'express';
import {BadRequestError} from '../common/error';
import {ResponseData, successResponse} from '../common/responses';
import {verifyRefreshTokenMiddleware, verifyTokenMiddleware} from '../middlewares/authMiddlewares';
import {verifySignature} from "../middlewares/signatureMiddlewares";
import authService from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import {RegisterRequest} from "../common/request_body/register";
import {RegisterInputDtoValidator} from '../middlewares/validator/authValidate';

const authWebRouter = Router();
authWebRouter.post(
    '/login',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth WEB']
        const {emailOrAccount, password} = req.body;
        if (!emailOrAccount || !password) throw new BadRequestError();
        const data = await authService.login({emailOrAccount, password});
        const {token, refreshToken, ...response} = data;
        const cookieOptions = {httpOnly: true};

        if (process.env.SECURED_ENDPOINT) Object.assign(cookieOptions, {secure: true});
        if (process.env.SAME_SITE) Object.assign(cookieOptions, {sameSite: process.env.SAME_SITE});
        else Object.assign(cookieOptions, {sameSite: 'none',secure:true});
        if (process.env.COOKIE_DOMAIN) Object.assign(cookieOptions, {domain: process.env.COOKIE_DOMAIN});
        res.cookie('x-access-token', token, {...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 365});
        res.cookie('x-refresh-token', refreshToken, {...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 365});
        const responseData = new ResponseData({result: response})
        return successResponse(res, responseData);
    })
);

authWebRouter.post(
    '/register',
    RegisterInputDtoValidator,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth WEB']
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

authWebRouter.get(
    '/logout',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // TODO: clear token REDIS
        // #swagger.tags = ['Auth WEB']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const credentials = req.credentials;
        if (credentials) {
            const userId = credentials.userId;
            const authId = credentials.authId;
            await authService.logout({userId, authId});
        }
        res.clearCookie('x-access-token');
        res.clearCookie('x-refresh-token');
        const responseData = new ResponseData({})
        return successResponse(res, responseData);
    })
)

authWebRouter.post(
    '/refresh-token',
    verifyRefreshTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth WEB']
        const {userId, authId} = req.credentials!;
        const accessToken = await authService.refreshToken({userId, authId});
        const cookieOptions = {httpOnly: true};
        if (process.env.SECURED_ENDPOINT) Object.assign(cookieOptions, {secure: true});
        if (process.env.SAME_SITE) Object.assign(cookieOptions, {sameSite: process.env.SAME_SITE});
        else Object.assign(cookieOptions, {sameSite: 'none',secure:true});
        if (process.env.COOKIE_DOMAIN) Object.assign(cookieOptions, {domain: process.env.COOKIE_DOMAIN});
        res.cookie('x-access-token', accessToken, {...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 365});
        return successResponse(res);
    })
)

authWebRouter.get(
    "/active",
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth WEB']
        const _id = req.query._id;
        const data = await authService.active(_id);
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    })
);

authWebRouter.post(
    "/changePassword",
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth WEB']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const credentials = req.credentials;
        if (credentials) {
            const userId = credentials?.userId;
            const {password, newPassword} = req.body;
            const data = await authService.changePassword({userId, password, newPassword});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        }
        throw new BadRequestError();
    })
);

authWebRouter.post(
    "/forgetPassword",
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth WEB']
        const {email} = req.body;
        const data = await authService.forgetPassword({email});
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    })
);

authWebRouter.post(
    "/setPassword",
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth WEB']
        const {_id, password} = req.body;
        const data = await authService.setPassword({_id, password});
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    })
)

authWebRouter.get(
    '/logout-all',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Auth WEB']
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
export default authWebRouter;
