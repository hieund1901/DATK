import ApiModel from "../models/Api";
import ApplicationApiModel from "../models/ApplicationApi";
import redisClient from "./redis";

const ObjectId = require('mongoose').Types.ObjectId;

export async function checkQuota(appId: string, key: string, path: string) {
    const redisKey = `${appId}_${key}_${path}`
    const dataInRedis = await redisClient.get(redisKey)
    if (dataInRedis !== null) {
        return parseInt(dataInRedis) > 0;
    } else {
        const api = await ApiModel.findOne({path: path});
        if (api == null) {
            return false;
        }
        const filterAppApi = {apiId: new ObjectId(api.id), appId: new ObjectId(appId)}
        const applicationApi = await ApplicationApiModel.findOne(filterAppApi);
        if (applicationApi != null && applicationApi.remainingAmount > 0 && applicationApi.key == key) {
            redisClient.set(redisKey, applicationApi.remainingAmount)
            return true;
        } else {
            return false;
        }
    }

}

export async function updateQuota(appId: string, key: string, path: string) {
    const redisKey = `${appId}_${key}_${path}`
    const api = await ApiModel.findOne({path: path});
    if (api == null) {
        return false;
    }
    const filterAppApi = {apiId: new ObjectId(String(api.id)), appId: new ObjectId(appId)}
    const dataUpdate = {$inc: {remainingAmount: -1, successRequest: 1}}
    const dataInRedis = await redisClient.get(redisKey)
    if (dataInRedis !== null) {
        const remainingAmount = parseInt(dataInRedis) - 1;
        redisClient.set(redisKey, remainingAmount)
    }
    await ApplicationApiModel.findOneAndUpdate(filterAppApi, dataUpdate)
}