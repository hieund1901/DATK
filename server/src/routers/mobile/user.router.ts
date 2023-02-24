import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import userService from '../../services/user.service';
import asyncHandler from '../../utils/asyncHandler';
import {verifySignature} from "../../middlewares/signatureMiddlewares";
import {ObjectId} from "bson";
import {ServerError} from "../../common/error";
import {fileErrorHandler} from "../../middlewares/errorHandlers";
import upload from "../../utils/multer";

const userRouterMobile = Router();

userRouterMobile.get(
    '/users/me',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Mobile User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const {userId, account} = req.credentials!;
        const responseData = new ResponseData({result: {userId, account}})
        return successResponse(res, responseData);
    })
)


userRouterMobile.get(
    '/users',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Mobile User']
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
userRouterMobile.get(
    '/users',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Mobile User']
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

userRouterMobile.put(
    '/users',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Mobile User']
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

userRouterMobile.post(
    '/users/avatar',
    upload.single('image'),
    fileErrorHandler,
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Mobile User']
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
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const {userId} = req.credentials!;
        const data = userService.uploadAvatar(req.file, userId)
        // TODO: get all information
        const responseData = new ResponseData({result: {data}})
        return successResponse(res, responseData);
    })
)

userRouterMobile.get(
    '/users/:id/avatar',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Mobile User']
        const userId = req.params.id;
        const data = await userService.getAvatar(userId);
        res.writeHead(200, {'Content-Type': 'image/jpeg'})
        data.pipe(res);
        return res;
    })
)

export default userRouterMobile;
