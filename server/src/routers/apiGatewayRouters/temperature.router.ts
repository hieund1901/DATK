import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import temperatureService from '../../services/apiGatewayServices/temperature.service';
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";
import {verifySignature} from "../../middlewares/signatureMiddlewares";

const temperatureRouter = Router();


temperatureRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Temperature']
        /* #swagger.security = [{
               "bearerAuth": []
        }] */
        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await temperatureService.getTemperature(token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)


temperatureRouter.post(
    '',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Temperature']
        /* #swagger.security = [{
               "bearerAuth": []
        }]
        #swagger.parameters['body'] = {
                in: 'body',
                schema: {
                    value: 37.5,
                    signature: ''
                 }}
        */

        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const {value} = req.body;
            const result = await temperatureService.uploadTemperatureData(value, token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)
export default temperatureRouter;