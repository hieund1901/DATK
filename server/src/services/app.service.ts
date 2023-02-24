import ApplicationModel from "../models/Application";

export default {
    getApps: async ({
                        page = 1,
                        pageSize = 10,
                        isPaging = true
                    }: { filter?: any; page?: number; pageSize?: number; isPaging?: boolean; }) => {
        let apps;
        if (isPaging) {
            const skippedApps = (page - 1) * pageSize;
            apps = await ApplicationModel.find({}).skip(skippedApps).limit(pageSize);
        } else {
            apps = await ApplicationModel.find({});
        }
        const total = await ApplicationModel.count({});
        const totalPage = isPaging ? Math.ceil(total / pageSize) : 1;
        return {
            result: {
                apps: apps
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
    addApp: async (args: { app: any }) => {
        return await ApplicationModel.create(args.app);
    },
    getApp: async (filter: any) => {
        const res = await ApplicationModel.findOne(filter);
        return {
            result: res
        }
    },
    updateApp: async (filter, app: any) => {
        return await ApplicationModel.findOneAndUpdate(filter, app);
    }
}
