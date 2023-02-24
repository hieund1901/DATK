import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import clientService from '../../services/client.service';
import asyncHandler from '../../utils/asyncHandler';
import {ObjectId} from "bson";
import {ServerError} from "../../common/error";
import {verifyTokenMiddleware} from "../../middlewares/authMiddlewares";

const clientRouter = Router();

clientRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Client']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const page = req.query.page ? parseInt(String(req.query.page)) : 1;
            const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : 10;
            const isPaging = String(req.query.isPaging) == "true";
            const {result, pagination} = await clientService.getClients({page, pageSize, isPaging});
            // TODO: get all information
            const responseData = new ResponseData({result, pagination})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

clientRouter.get(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Client']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {result} = await clientService.getClient({'_id': new ObjectId(req.params.id)});
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)


clientRouter.post(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Client']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {name, description, functions} = req.body;
            const data = await clientService.addClient({client: {name, description, functions}});
            const responseData = new ResponseData({result: data});
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

clientRouter.put(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Client']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {name, description, functions} = req.body;
            const data = await clientService.updateClient({'_id': new ObjectId(req.params.id)},
                {$set: {name, description, functions}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

clientRouter.delete(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['ADMIN Client']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const data = await clientService.updateClient({'_id': new ObjectId(req.params.id)},
                {$set: {isDeleted: true}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)


export default clientRouter;
