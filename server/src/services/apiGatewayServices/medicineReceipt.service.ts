import axiosClient from "./axios.client";
import {checkQuota, updateQuota} from "../../utils/api.quota";
import {BadRequestError, ServerError} from "../../common/error";
import {HttpStatusCode} from "../../common/enum/httpStatusCode";

const path = '/api/medicineReceipt';
const url = `/medicineReceipt`;

export default {
    getMedicineReceipt: async (token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }

        updateQuota(appId, key, path);
        const response = await axiosClient.get(url, {headers: {Authorization: token}});
        return response.data.result;
    },
    uploadMedicineReceiptData: async (drugs, name, token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const data = {drugs, name}
        updateQuota(appId, key, path);
        await axiosClient.post(url, data, {
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        });
        return {message: 'Save new receipt success'};
    },
    deleteMedicineReceiptData: async (token, appId, key, receiptIds) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        updateQuota(appId, key, path);
        receiptIds.map(async (receiptId)=>{
            await axiosClient.delete(`${url}/${receiptId}`, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                }
            });
        })

        return {message: 'Delete receipt success'};
    }

}