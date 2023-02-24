import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import userRoleService from '../../services/userRole.service';
import asyncHandler from '../../utils/asyncHandler';
import {ObjectId} from "bson";
import {ServerError} from "../../common/error";
import { verifyTokenMiddleware } from '../../middlewares/authMiddlewares';

const userRoleRouter = Router();

userRoleRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN UserRole']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const {result, pagination} = await userRoleService.getUserRoles({});
        // TODO: get all information
        const responseData = new ResponseData({result, pagination})
        return successResponse(res, responseData);
    })
)


userRoleRouter.post(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN UserRole']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const {userId, roleId} = req.body;
        const data = await userRoleService.addUserRole({userRole: {userId, roleId}});
        const responseData = new ResponseData({result: {data}});
        return successResponse(res, responseData);
    })
)

userRoleRouter.put(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN UserRole']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {name, description, functions} = req.body;
            const data = await userRoleService.updateUserRole({'_id': new ObjectId(req.params.id)},
                {$set: {name, description, functions}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

userRoleRouter.delete(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN UserRole']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const data = await userRoleService.deleteUserRole({'_id': new ObjectId(req.params.id)});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)
export default userRoleRouter;
