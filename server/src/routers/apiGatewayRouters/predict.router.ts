import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";
import upload from "../../utils/multer";
import predictService from "../../services/apiGatewayServices/predict.service";
import apiHistoryService from "../../services/admin/apiHistory.service";
import {uploadFile} from "../../utils/storage";
const onFinished = require('on-finished');
const predictRouter = Router();
import { v4 as uuidv4 } from 'uuid';
import * as AppStatus from '../../../src/common/const/appStatus';
predictRouter.post(
    '',
    upload.single('image'),
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Predict']
        /*  #swagger.security = [{
               "bearerAuth": []
        }]

        */
        /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            image: {
                                type: "string",
                                format: "binary"
                            }
                        },
                        required: ["image"]
                    }
                }
            }
        }
    */
        let startTime, endTime;
        let responseBody;
        startTime = new Date();


        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await predictService.predict(req.file, token, appid, key);
            const responseData = new ResponseData({result})
            responseBody = responseData;
            return successResponse(res, responseData);
        } catch (error) {
            responseBody = {message: String(error), appStatus: AppStatus.UNDEFINED_ERROR};
            throw new ServerError({message: String(error)});
        } finally {
            onFinished(res, async function () {
                const imageName = `${uuidv4()}.jpg`;
                uploadFile('predict', `${imageName}`, req.file.buffer);
                const imageUrl = `${process.env.SERVER_URL}/admin/api/history/file?fileName=${imageName}&bucket=predict`
                const user = req.credentials?.account || '';
                endTime = new Date();
                const responseTime = endTime - startTime; //in ms
                const status = res.statusCode;
                await apiHistoryService.logApiHistory('/predict', '628fa6646413e9e65ed75df4', req.headers.appid, req.credentials?.userId, user,
                    'POST', {headers:req.headers, body: req.body, file: `${imageUrl}`}, {statusCode: status, body: responseBody}, status , responseTime, '')
            })

        }
    })
)
export default predictRouter;