import ClientModel from "../models/Client";

export default {
    getClients: async ({
                           page = 1,
                           pageSize = 10,
                           isPaging = true
                       }: { filter?: any; page?: number; pageSize?: number; isPaging?: boolean; }) => {
        let clients;
        if (isPaging) {
            const skippedClients = (page - 1) * pageSize;
            // clients = [];
            // await ClientModel.create({name:'test'})
            clients = await ClientModel.find({}).skip(skippedClients).limit(pageSize);
        } else {
            clients = await ClientModel.find({});
        }
        const total = await ClientModel.count({});
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
    addClient: async (args: { client: any }) => {
        return await ClientModel.create(args.client);
    },
    getClient: async (filter: any) => {
        const res = await ClientModel.findOne(filter);
        return {
            result: res
        }
    },
    updateClient: async (filter, client: any) => {
        return await ClientModel.findOneAndUpdate(filter, client);
    }
}
