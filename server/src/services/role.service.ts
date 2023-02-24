import RoleModel from "../models/Role";
import {Types} from "mongoose";

export default {
    getRoles: async ({
                         page = 1,
                         pageSize = 10,
                         isPaging = true
                     }: { filter?: any; page?: number; pageSize?: number; isPaging?: boolean; }) => {
        let roles;
        if (isPaging) {
            const skippedRoles = (page - 1) * pageSize;
            // clients = [];
            // await RoleModel.create({name:'test'})
            roles = await RoleModel.find({}).skip(skippedRoles).limit(pageSize);
        } else {
            roles = await RoleModel.find({});
        }
        const total = await RoleModel.count({});
        const totalPage = isPaging ? Math.ceil(total / pageSize) : 1;
        return {
            result: {
                roles: roles
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
    addRole: async (args: { role: any }) => {
        let role = args.role;
        role.clientId = new Types.ObjectId(role.clientId);
        const client = await RoleModel.findOne({'_id': role.clientId});
        if (client != null) {
            role.clientName = client.name;
        }
        const res = await RoleModel.create([role])
        return {
            res: res
        }
    },

    getRole: async (filter: any) => {
        const res = await RoleModel.findOne(filter);
        return {
            result: res
        }
    },
    updateRole: async (filter, role: any) => {
        return RoleModel.findOneAndUpdate(filter, role);
    }
}
