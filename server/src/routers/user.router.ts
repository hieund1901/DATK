import {Router} from 'express';
import {ResponseData, successResponse} from '../common/responses';
import {verifyTokenMiddleware} from '../middlewares/authMiddlewares';
import userService from '../services/user.service';
import {verifySignature} from "../middlewares/signatureMiddlewares";
import asyncHandler from '../utils/asyncHandler';
import {ObjectId} from "bson";
import {BadRequestError, ServerError} from "../common/error";
import upload from "../utils/multer";
import {fileErrorHandler} from "../middlewares/errorHandlers";
import {RegisterRequest} from "../common/request_body/register";
import {authService} from '../services/auth.service';

const userRouter = Router();

userRouter.get(
    '/me',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const {userId, account} = req.credentials!;
        // const data = await userService.getUser({ userId });
        // TODO: get all information
        const responseData = new ResponseData({result: {userId, account}})
        return successResponse(res, responseData);
    })
)


userRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const {userId} = req.credentials!;
        const data = await userService.getUser({userId});
        // // TODO: get all information
        const responseData = new ResponseData({result: data});
        return successResponse(res, responseData);
    })
)

userRouter.put(
    '',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {dateOfBirth, name, gender, account} = req.body;
            const {userId} = req.credentials!;
            const data = await userService.updateUser({'_id': new ObjectId(userId)},
                {$set: {dateOfBirth, name, gender, account}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

userRouter.post(
    '/avatar',
    upload.single('image'),
    fileErrorHandler,
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            image: {
                                type: "string",
                                format: "binary"
                            }
                        },
                        required: ["image"]
                    }
                }
            }
        }
    */
        const {userId} = req.credentials!;
        const data = userService.uploadAvatar(req.file, userId)
        // TODO: get all information
        const responseData = new ResponseData({result: {data}})
        return successResponse(res, responseData);
    })
)

userRouter.get(
    '/:id/avatar',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User']
        const userId = req.params.id;
        const data = await userService.getAvatar(userId);
        // TODO: get all information
        res.writeHead(200, {'Content-Type': 'image/jpeg'})
        data.pipe(res);
        return res;
    })
)

userRouter.post(
    '',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const registerRequest: RegisterRequest = req.body;
        if (!registerRequest.email || !registerRequest.password) throw new BadRequestError();
        const data = await authService.verifyByGmail(registerRequest);
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    }))

export default userRouter;
