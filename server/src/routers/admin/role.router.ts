import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import roleService from '../../services/role.service';
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";
import {ObjectId} from "bson";
import {verifyTokenMiddleware} from "../../middlewares/authMiddlewares";

const roleRouter = Router();

roleRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Role']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const page = req.query.page ? parseInt(String(req.query.page)) : 1;
            const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : 10;
            const isPaging = String(req.query.isPaging) == "true";
            const {result, pagination} = await roleService.getRoles({page, pageSize, isPaging});
            const responseData = new ResponseData({result, pagination})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }

    })
)


roleRouter.get(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Role']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {result} = await roleService.getRole({'_id': new ObjectId(req.params.id)});
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)


roleRouter.post(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Role']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const {name, description, roleId, functions} = req.body;
        const data = await roleService.addRole({role: {name, description, roleId, functions}});
        const responseData = new ResponseData({result: {data}});
        return successResponse(res, responseData);
    })
)


roleRouter.put(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Role']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {name, description, functions} = req.body;
            const data = await roleService.updateRole({'_id': new ObjectId(req.params.id)},
                {$set: {name, description, functions}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

roleRouter.delete(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Role']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const data = await roleService.updateRole({'_id': new ObjectId(req.params.id)},
                {$set: {isDeleted: true}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

export default roleRouter;
