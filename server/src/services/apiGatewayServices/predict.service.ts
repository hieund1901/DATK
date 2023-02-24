import axiosClient from "./axios.client";
import FormData from "form-data";
import {checkQuota, updateQuota} from "../../utils/api.quota";
import {ServerError} from "../../common/error";

const path = '/predict';

export default {
    predict: async (image, token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const url = `/predict`;
        const formData = new FormData();
        formData.append('file', image.buffer, 'test.jpg');
        updateQuota(appId, key, path);
        const response = await axiosClient.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token,
                "Content-Type": "multipart/form-data"
            }, baseURL: process.env.VAIPE_PREDICT_HOST
        });
        return response.data.result;
    }
}