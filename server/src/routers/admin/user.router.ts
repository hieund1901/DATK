import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import userService from '../../services/admin/admin.user.service';
import asyncHandler from '../../utils/asyncHandler';
import {BadRequestError, ServerError} from "../../common/error";
import {ObjectId} from "bson";
import { verifyTokenMiddleware } from '../../middlewares/authMiddlewares';
import { verifySignature } from '../../middlewares/signatureMiddlewares';
import authService from '../../services/auth.service';
import { RegisterRequest } from '../../common/request_body/register';

const userRouter = Router();

userRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN User']
        /* #swagger.parameters['page'] = {
            in: 'query',
            type: 'integer',
            schema: 1
        }
            #swagger.parameters['pageSize'] = {
            in: 'query',
            type: 'integer',
            schema: 10
        }
        #swagger.parameters['isPaging'] = {
            in: 'query',
            type: 'boolean',
            schema: true
        }
        #swagger.parameters['createdAt'] = {
            in: 'query',
            type: 'string',
            schema: '2022-05-01'
        }
        #swagger.parameters['applications'] = {
            in: 'query',
            type: 'array',
            schema: ['vaipe app']
        }
        #swagger.parameters['email'] = {
            in: 'query',
            type: 'string',
            schema: 'example@gmail.com'
        },
        #swagger.parameters['gender'] = {
            in: 'query',
            schema: {
                '@enum': ['male','female','other']
            }
        },
        #swagger.parameters['name'] = {
            in: 'query',
            type: 'string',
            schema: 'Nguyễn Văn A'
        },

        */
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const page = req.query.page ? parseInt(String(req.query.page)) : 1;
            const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : 10;
            const isPaging = String(req.query.isPaging) == "true";
            const filter = req.query;
            const {result, pagination} = await userService.getUsers({filter, page, pageSize, isPaging});
            const responseData = new ResponseData({result, pagination})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }

    })
)


userRouter.get(
    '/:id',
    // verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const result = await userService.getUser({userId: String(req.params.id)});
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

userRouter.put(
    '/:id',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {name, description, functions} = req.body;
            const data = await userService.updateUser({'_id': new ObjectId(req.params.id)},
                {$set: {name, description, functions}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

userRouter.delete(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const data = await userService.updateUser({'_id': new ObjectId(req.params.id)},
                {$set: {isDeleted: true}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

userRouter.post(
    '',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN User']
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
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const registerRequest: RegisterRequest = req.body;
        if (!registerRequest.email || !registerRequest.password) throw new BadRequestError();
        const data = await authService.verifyByGmail(registerRequest);
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    }))

userRouter.post(
    '/:id/resetPassword',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN User']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const userId = req.params.id;
        const {password} = req.body;
        const data = await userService.setPassword({userId, password});
        const responseData = new ResponseData({result: data})
        return successResponse(res, responseData);
    })

)

export default userRouter;
