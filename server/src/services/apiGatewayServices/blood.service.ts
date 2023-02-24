import axiosClient from "./axios.client";
import {ServerError} from "../../common/error";
import {checkQuota, updateQuota} from "../../utils/api.quota";

const FormData = require('form-data');

const path = '/api/blood'
export default {
    getBlood: async (token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const url = `/blood`;
        updateQuota(appId, key, path);
        const response = await axiosClient.get(url, {headers: {Authorization: token}});
        return response.data.result;
    },
    uploadBloodData: async (value, token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const url = `/blood`;
        const data = {value: value}
        updateQuota(appId, key, path);
        return await axiosClient.post(url, data, {headers: {Authorization: token, "Content-Type": "application/json"}});
    }
}