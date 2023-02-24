import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import ecgService from '../../services/apiGatewayServices/ecg.service';
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";
import {verifySignature} from "../../middlewares/signatureMiddlewares";

const ecgRouter = Router();


ecgRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Ecg']
        /* #swagger.security = [{
               "bearerAuth": []
        }] */
        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await ecgService.getEcg(token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)


ecgRouter.post(
    '',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Ecg']
        /*  #swagger.security = [{
               "bearerAuth": []
        }]
        #swagger.parameters['body'] = {
                in: 'body',
                schema: {
                  "value": {
                    "I": [],
                    "II": [],
                    "III": [],
                    "V1": [],
                    "V2": [],
                    "V3": [],
                    "V4": [],
                    "V5": [],
                    "V6": [],
                    "aVF": [],
                    "aVL": [],
                    "aVR": []
                  },
                  "name": "ecg demo",
                  "signature": ""
                }}
        */

        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const {value, name} = req.body;
            const result = await ecgService.uploadEcgData(value, name, token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

ecgRouter.delete(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Ecg']
        /*  #swagger.security = [{
               "bearerAuth": []
        }]
        #swagger.parameters['body'] = {
        in: 'body',
        required: 'true',
        schema: {
        ecgIds: []
        }
        }*/
        try {
            const {ecgIds} = req.body;
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await ecgService.deleteEcgData(ecgIds, token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)
export default ecgRouter;