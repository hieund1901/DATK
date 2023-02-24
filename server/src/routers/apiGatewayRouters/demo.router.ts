import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {createSignature, verifySignature} from "../../middlewares/signatureMiddlewares";
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";

const demoRouter = Router();


demoRouter.post(
    '/verify',
    // verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Demo signature']

        try {
            const responseData = new ResponseData({
                result: {
                    ...req.body,
                    message: 'verified'
                }
            })
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

demoRouter.post(
    '/sign',
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Demo signature']
        /*  #swagger.parameters['body'] = {
               in: 'body',
               "schema": {
                  "type": "object",
                  "properties": {}
               }
        } */
        try {
            const signature = createSignature(req.body);
            const responseData = new ResponseData({
                result: {
                    ...req.body,
                    signature: signature
                }
            })
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)
export default demoRouter;