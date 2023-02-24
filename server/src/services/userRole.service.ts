import UserRoleModel from "../models/UserRole";
import {Types} from "mongoose";
import RoleModel from "../models/Role";

export default {
    getUserRoles: async ({
                             page = 1,
                             pageSize = 10,
                             isPaging = true
                         }: { filter?: any; page?: number; pageSize?: number; isPaging?: boolean; }) => {
        let userRoles;
        if (isPaging) {
            const skippedClients = (page - 1) * pageSize;
            userRoles = await UserRoleModel.find({}).skip(skippedClients).limit(pageSize);
        } else {
            userRoles = await UserRoleModel.find({});
        }
        const total = await UserRoleModel.count({});
        const totalPage = isPaging ? Math.ceil(total / pageSize) : 1;
        return {
            result: {
                userRoles: userRoles
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
    addUserRole: async (args: { userRole: any }) => {
        let userRole = args.userRole;
        userRole.userId = new Types.ObjectId(userRole.userId);
        userRole.roleId = new Types.ObjectId(userRole.roleId);

        //get info role:
        const role = await RoleModel.findOne({'_id': userRole.roleId});
        if (role != null) {
            userRole.roleName = role.name;
            userRole.clientId = role.clientId;
            userRole.clientName = role.clientName;
        }
        const res = await UserRoleModel.create([userRole])
        return {
            res: res
        }
    },
    updateUserRole: async (filter, userRole: any) => {
        return RoleModel.findOneAndUpdate(filter, userRole);
    },
    deleteUserRole: async (filter) => {
        return RoleModel.findOneAndDelete(filter);
    }
}
