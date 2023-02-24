import axiosClient from "./axios.client";
import {ServerError} from "../../common/error";
import {checkQuota, updateQuota} from "../../utils/api.quota";

const path = '/api/ecg';
const url = `/ecg`;

export default {
    getEcg: async (token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        updateQuota(appId, key, path);
        const response = await axiosClient.get(url, {headers: {Authorization: token}});
        return response.data.result;
    },
    uploadEcgData: async (value, name, token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const data = {value: value, name: name}
        updateQuota(appId, key, path);
        await axiosClient.post(url, data, {headers: {Authorization: token, "Content-Type": "application/json"}});
        return {message: 'Save new ecg success'};
    },
    deleteEcgData: async (ecgIds, token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        updateQuota(appId, key, path);
        ecgIds.map(async (ecgId)=>{
            await axiosClient.delete(`${url}/${ecgId}`, {headers: {Authorization: token, "Content-Type": "application/json"}});
        })
        return {message: 'Delete ecg success'}
    }

}