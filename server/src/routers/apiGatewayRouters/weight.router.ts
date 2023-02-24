import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import weightService from '../../services/apiGatewayServices/weight.service';
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";
import {verifySignature} from "../../middlewares/signatureMiddlewares";

const weightRouter = Router();


weightRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Weight']
        /* #swagger.security = [{
               "bearerAuth": []
        }] */
        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await weightService.getWeight(token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

weightRouter.post(
    '',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Weight']
        /* #swagger.security = [{
               "bearerAuth": []
        }]
        #swagger.parameters['body'] = {
                in: 'body',
                schema: {
                    value: 60.5,
                    signature: ''
                 }}
        */

        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const {value} = req.body;
            const result = await weightService.uploadWeightData(value, token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)
export default weightRouter;