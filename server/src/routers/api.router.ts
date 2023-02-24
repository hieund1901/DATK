import {Router} from 'express';
import {ResponseData, successResponse} from '../common/responses';
import {verifyTokenMiddleware} from '../middlewares/authMiddlewares';
import apiService from '../services/api.service';
import asyncHandler from '../utils/asyncHandler';
import {ObjectId} from "bson";
import {ServerError} from "../common/error";

const apiRouter = Router();

apiRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Api']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const page = req.query.page ? parseInt(String(req.query.page)) : 1;
            const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : 10;
            const isPaging = String(req.query.isPaging) == "true";
            const {result, pagination} = await apiService.getApis({page, pageSize, isPaging});
            // TODO: get all information
            const responseData = new ResponseData({result, pagination})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

apiRouter.get(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Api']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        try {
            const {result} = await apiService.getApi({'_id': new ObjectId(req.params.id)});
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

apiRouter.post(
    '/register',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['Api']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        /*  #swagger.parameters['body'] = {
               in: 'body',
              schema: {
                'appId': '',
                'apis': []
              }

        } */
        try {
            const apis: string[] = req.body.apis;
            const appId: string = req.body.appId;
            const {result} = await apiService.registerTrialApi(apis, appId);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

export default apiRouter;
