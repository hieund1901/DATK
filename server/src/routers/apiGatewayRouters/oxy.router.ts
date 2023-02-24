import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import oxyService from '../../services/apiGatewayServices/oxy.service';
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";
import {verifySignature} from "../../middlewares/signatureMiddlewares";

var multer = require('multer');
var upload = multer();

const oxyRouter = Router();


oxyRouter.get(
    '',
    // verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Oxy']
        /*  #swagger.security = [{
               "bearerAuth": []
        }] */
        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await oxyService.getOxy(token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

oxyRouter.post(
    '',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Oxy']
        /*  #swagger.security = [{
               "bearerAuth": []
        }]
        #swagger.parameters['body'] = {
                in: 'body',
                schema: {
                    value: 99.5,
                    signature: ''
                 }}
        */

        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const {value} = req.body;
            const result = await oxyService.uploadOxyData(value, token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)
export default oxyRouter;