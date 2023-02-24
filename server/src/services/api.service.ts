import ApiModel from "../models/Api";
import ApplicationApiModel from "../models/ApplicationApi";
import {ObjectId} from "bson";
import {v4 as uuidv4} from 'uuid';

export default {
    getApis: async ({
                        page = 1,
                        pageSize = 10,
                        isPaging = true
                    }: { filter?: any; page?: number; pageSize?: number; isPaging?: boolean; }) => {
        let clients;
        if (isPaging) {
            const skippedClients = (page - 1) * pageSize;
            clients = await ApiModel.find({}).skip(skippedClients).limit(pageSize);
        } else {
            clients = await ApiModel.find({});
        }
        const total = await ApiModel.count({});
        const totalPage = isPaging ? Math.ceil(total / pageSize) : 1;
        return {
            result: {
                clients: clients
            },
            pagination: {
                total: total,
                totalPage: totalPage,
                page: page,
                pageSize: pageSize,
                isPaging: isPaging
            }
        }
    },
    getApi: async (filter: any) => {
        const res = await ApiModel.findOne(filter);
        return {
            result: res
        }
    },
    registerTrialApi: async (apiIds: any, appId: string) => {
        const apiFilter: any[] = [];
        apiIds.forEach(id => {
            apiFilter.push({'_id': new ObjectId(id)});
        })
        const apis = await ApiModel.find({'$or': apiFilter});
        const key = uuidv4();
        let data: any[] = [];
        apis.forEach(api => {
            data.push({
                appId: new ObjectId(appId), apiId: api._id, quota: api.packages.TRIAL.quota,
                remainingAmount: api.packages.TRIAL.quota, failRequest: 0, successRequest: 0, package: 'TRIAL', key
            })
        })
        await ApplicationApiModel.insertMany(data);
        const res = {'key': key}
        return {
            result: res
        }
    },


}
