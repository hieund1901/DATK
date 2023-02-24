import axiosClient from "./axios.client";
import {checkQuota, updateQuota} from "../../utils/api.quota";
import {ServerError} from "../../common/error";

const path = '/api/weight';
export default {
    getWeight: async (token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const url = `/weights`;
        updateQuota(appId, key, path);
        const response = await axiosClient.get(url, {headers: {Authorization: token}});
        return response.data.result;
    },
    uploadWeightData: async (value, token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const url = `/weights`;
        const data = {value: value}
        updateQuota(appId, key, path);
        return await axiosClient.post(url, data, {headers: {Authorization: token, "Content-Type": "application/json"}});
    }
}