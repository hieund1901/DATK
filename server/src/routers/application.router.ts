import {Router} from 'express';
import {ResponseData, successResponse} from '../common/responses';
import {verifyTokenMiddleware} from '../middlewares/authMiddlewares';
import appService from '../services/app.service';
import asyncHandler from '../utils/asyncHandler';
import {ObjectId} from "bson";
import {ServerError} from "../common/error";
import {verifySignature} from '../middlewares/signatureMiddlewares';

const appRouter = Router();

appRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User App']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const page = req.query.page ? parseInt(String(req.query.page)) : 1;
            const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : 10;
            const isPaging = String(req.query.isPaging) == "true";
            const {result, pagination} = await appService.getApps({page, pageSize, isPaging});
            // TODO: get all information
            const responseData = new ResponseData({result, pagination})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

appRouter.get(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User App']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {result} = await appService.getApp({'_id': new ObjectId(req.params.id)});
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)


appRouter.post(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User App']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {name, description, functions} = req.body;
            const data = await appService.addApp({app: {name, description, functions}});
            const responseData = new ResponseData({result: data});
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

appRouter.put(
    '/:id',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User App']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {name, description, functions} = req.body;
            const data = await appService.updateApp({'_id': new ObjectId(req.params.id)},
                {$set: {name, description, functions}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

appRouter.delete(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User App']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const data = await appService.updateApp({'_id': new ObjectId(req.params.id)},
                {$set: {isDeleted: true}});
            const responseData = new ResponseData({result: data})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)


export default appRouter;
