import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import {verifySignature} from "../../middlewares/signatureMiddlewares";
import bloodService from '../../services/apiGatewayServices/blood.service';
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";

const multer = require('multer');
const upload = multer();
const bloodRouter = Router();


bloodRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Blood']
        /* #swagger.security = [{
               "bearerAuth": []
        }] */
        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await bloodService.getBlood(token, appid, key);
            const responseData = new ResponseData({result});
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

bloodRouter.post(
    '',
    upload.single('image'),
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Blood']
        /* #swagger.security = [{
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
            const result = await bloodService.uploadBloodData(value, token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)
export default bloodRouter;