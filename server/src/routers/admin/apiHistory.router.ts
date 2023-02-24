import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import apiHistoryService from '../../services/admin/apiHistory.service';
import asyncHandler from '../../utils/asyncHandler';
import userService from "../../services/user.service";
import userRouter from "../user.router";

const apiHistoryRouter = Router();


apiHistoryRouter.get(
    '/file',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API HISTORY']
        const fileName = req.query.fileName;
        const bucket = req.query.bucket;
        const data = await apiHistoryService.getImage(bucket, fileName);
        // TODO: get all information
        res.writeHead(200, {'Content-Type': 'image/jpeg'})
        data.pipe(res);
        return res;
    })
)

apiHistoryRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API HISTORY']
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
        #swagger.parameters['status'] = {
            in: 'query',
            type: 'integer',
            schema: 200
        }
        #swagger.parameters['startTime'] = {
            in: 'query',
            type: 'string',
            schema: '2022-05-01'
        }
        #swagger.parameters['endTime'] = {
            in: 'query',
            type: 'string',
            schema: '2022-05-31'
        }
        #swagger.parameters['feedback'] = {
            in: 'query',
            type: 'boolean',
            schema: true
        },
        #swagger.parameters['minResTime'] = {
            in: 'query',
            type: 'number',
            schema: 0.01
        },
        #swagger.parameters['maxResTime'] = {
            in: 'query',
            type: 'number',
            schema: 1.0
        }
        #swagger.parameters['apiIds'] = {
            in: 'query',
            schema: []
        }
        #swagger.security = [{
               "bearerAuth": []
        }]
        */
        const page = req.query.page ? parseInt(String(req.query.page)) : 1;
        const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : 10;
        const isPaging = String(req.query.isPaging) == "true";

        const status = req.query.status?Number(req.query.status): undefined;
        const startTime = req.query.startTime ? new Date(String(req.query.startTime)) : undefined;
        const endTime = req.query.endTime ? new Date(String(req.query.endTime)) : undefined;
        const feedback = req.query.feedback ? String(req.query.feedback) == 'true' : undefined;
        const minResTime = req.query.minResTime ? Number(req.query.minResTime) : undefined;
        const maxResTime = req.query.maxResTime ? Number(req.query.maxResTime) : undefined;
        const user = req.query.user ? String(req.query.user) : undefined;
        const {apiIds} = req.query;
        const application = req.query.application ? String(req.query.application) : undefined;

        const {result, pagination} = await apiHistoryService.getApiHistory({
            filter: {
                user,
                apiIds,
                application,
                status,
                startTime,
                endTime,
                feedback,
                minResTime,
                maxResTime
            }, page, pageSize, isPaging
        });
        const responseData = new ResponseData({result, pagination})
        return successResponse(res, responseData);
    })
);

apiHistoryRouter.get(
    '/:id',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API HISTORY']
        /*#swagger.security = [{
            "bearerAuth": []
        }]*/
        const id = req.params.id;
        const result = await apiHistoryService.getApiHistoryById(id);
        const responseData = new ResponseData({result})
        return successResponse(res, responseData);
    })
);



export default apiHistoryRouter;