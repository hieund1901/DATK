import ApiRequestHistoryModel from "../../models/ApiRequestHistory";
import appService from "../app.service";
import ApplicationModel from "../../models/Application";
import {ObjectId} from "bson";
import {getFile} from "../../utils/storage";
import mongoose from "mongoose";


export default {
    getApiHistory: async ({filter = {}, page = 1, pageSize = 10, isPaging = true}:
                              {
                                  filter?: {
                                      user?: string,
                                      apiIds?: any,
                                      application?: string,
                                      status?: number,
                                      startTime?: Date,
                                      endTime?: Date,
                                      feedback?: boolean,
                                      minResTime?: number,
                                      maxResTime?: number
                                  };
                                  page?: number;
                                  pageSize?: number;
                                  isPaging?: boolean;
                              }) => {

        let listApiHistory;
        let condition = {};

        if (filter.status) {
            condition['status'] = filter.status;
        }

        if (filter.startTime && filter.endTime) {
            condition['createdAt'] = {'$gte': filter.startTime, '$lte': filter.endTime}
        } else if (filter.startTime) {
            condition['createdAt'] = {'$gte': filter.startTime}
        } else if (filter.endTime) {
            condition['createdAt'] = {'$lte': filter.endTime}
        }

        if (filter.feedback) {
            condition['feedback'] = {'$ne': ""};
        }

        if (filter.maxResTime && filter.minResTime) {
            condition['responseTime'] = {$lte: filter.maxResTime, $gte: filter.minResTime};
        } else if (filter.minResTime) {
            condition['responseTime'] = {$gte: filter.minResTime};
        } else if (filter.maxResTime) {
            condition['responseTime'] = {$lte: filter.maxResTime};
        }

        if (filter.application) {
            condition['application'] = {'$regex': filter.application};
        }

        if (filter.apiIds) {
            if(typeof filter.apiIds =='string') condition['apiId'] = {'$in':[`${new ObjectId(filter.apiIds)}`]}
            else {
                let apiIds: ObjectId[] = [];
                let index = 0;
                filter.apiIds.map((apiId)=>{
                    apiIds[index] = new ObjectId(apiId);
                    index +=1 ;
                })
                condition['apiId'] = {'$in': apiIds}
            }
        }

        if (filter.user) {
            condition['user'] = {'$regex':filter.user};
        }

        console.log(condition)
        if (isPaging) {
            listApiHistory = await ApiRequestHistoryModel.find(condition).limit(pageSize).skip((page - 1) * pageSize);
        } else {
            listApiHistory = await ApiRequestHistoryModel.find(condition);
        }

        const total = await ApiRequestHistoryModel.count(condition);
        const totalPage = isPaging ? Math.ceil(total / pageSize) : 1;
        return {
            result: {
                listApiHistory: listApiHistory,
            },
            pagination: {
                total: total,
                totalPage: totalPage,
                page: page,
                pageSize: pageSize,
                isPaging: isPaging,
            }
        }
    },

    getApiHistoryById: async (id: string) => {
        const apiHistory = await ApiRequestHistoryModel.findById(id);
        return apiHistory;
    },
    logApiHistory: async (api, apiId, appId, userId, user, method, request, response, status, responseTime, feedback) => {
        const app = await ApplicationModel.findById(appId)
        const appName = app?.name;
        // await ApiRequestHistoryModel.create([{api, application: appName, user, method, request, response, responseTime, feedback}])
        await ApiRequestHistoryModel.create([{api, apiId:new ObjectId(apiId),application: appName, user, method, status, responseTime, feedback, request, response}])
    },
    getImage: async (bucket, fileName) => {
    return getFile(bucket, fileName);
}
}