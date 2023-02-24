import axiosClient from "./axios.client";
import {ServerError} from "../../common/error";
import {checkQuota, updateQuota} from "../../utils/api.quota";

const path = '/api/health';

export default {
    getHealth: async (token, appId, key) => {
        const isCallable = await checkQuota(appId, key, path);
        if (!isCallable) {
            throw new ServerError({message: 'You cannot call this API.'});
        }
        const url = `/health`;
        updateQuota(appId, key, path);
        const response = await axiosClient.get(url, {headers: {Authorization: token}});
        return response.data.result;
    }
}