import axiosClient from "./axios.client";
import {checkQuota, updateQuota} from "../../utils/api.quota";
import {ServerError} from "../../common/error";

const path = '/api/temperature';

export default {
    getTemperature: async (token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const url = `/temperature`;
        updateQuota(appId, key, path);
        const response = await axiosClient.get(url, {headers: {Authorization: token}});
        return response.data.result;
    },
    uploadTemperatureData: async (value, token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const url = `/temperature`;
        const data = {value: value}
        updateQuota(appId, key, path);
        return await axiosClient.post(url, data, {headers: {Authorization: token, "Content-Type": "application/json"}});
    }
}