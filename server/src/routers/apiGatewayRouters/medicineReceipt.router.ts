import {Router} from 'express';
import {ResponseData, successResponse} from '../../common/responses';
import {verifyTokenMiddleware} from '../../middlewares/authMiddlewares';
import medicineReceiptService from '../../services/apiGatewayServices/medicineReceipt.service';
import asyncHandler from '../../utils/asyncHandler';
import {ServerError} from "../../common/error";
import {verifySignature} from "../../middlewares/signatureMiddlewares";

const medicineReceiptRouter = Router();


medicineReceiptRouter.get(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Medicine Receipt']
        /*  #swagger.security = [{
               "bearerAuth": []
        }] */
        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await medicineReceiptService.getMedicineReceipt(token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)


medicineReceiptRouter.post(
    '',
    verifyTokenMiddleware,
    verifySignature,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Medicine Receipt']
        /*  #swagger.security = [{
               "bearerAuth": []
        }]
        #swagger.parameters['body'] = {
                in: 'body',
                schema: {
                    name: 'ecg demo',
                    drugs: [
                    {
                      "name": "Flu drug",
                      "quantity": 5,
                      "price": 10000
                    }
                    ],
                    signature: ''
                 }}
        */

        try {
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const {drugs, name} = req.body;
            const result = await medicineReceiptService.uploadMedicineReceiptData(drugs, name, token, appid, key);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

medicineReceiptRouter.delete(
    '',
    verifyTokenMiddleware,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['API Gateway - Medicine Receipt']
        /*  #swagger.security = [{
               "bearerAuth": []
        }]
         #swagger.parameters['body'] = {
            in: 'body',
            required: 'true',
            schema: {
            receiptIds: []
            }
         */
        try {
            const {receiptIds} = req.body;
            const token = req.headers.authorization;
            const {appid, key} = req.headers;
            const result = await medicineReceiptService.deleteMedicineReceiptData(token, appid, key, receiptIds);
            const responseData = new ResponseData({result})
            return successResponse(res, responseData);
        } catch (error) {
            throw new ServerError({message: String(error)});
        }
    })
)

export default medicineReceiptRouter;