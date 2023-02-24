import {BadRequestError} from '../../common/error';
import UserModel from "../../models/User";
import * as appStatus from '../../common/const/appStatus';
import {decodePassword, hashPassword} from "../../utils/encryption";
import UserRoleModel from '../../models/UserRole';
const ObjectId = require('mongoose').Types.ObjectId;

export default {
    getUser: async (args: { userId: string }) => {
        const {userId} = args;

        const user = await UserModel.findOne({_id: userId}, '-password').exec();
        if (!user) throw new BadRequestError({data: null, appStatus: appStatus.USER_NOT_EXISTED});
        const roles = await UserRoleModel.find({userId:new ObjectId(userId)});
        const applications = roles.map((role) => ({application:role.clientName, roleName:role.roleName, roleId: role.id}))

        let userJson = user.toJSON();
        if (!userJson.avatar) {
            userJson.avatar = '';
        }

        return {
            ...userJson,
            applications,
            userId: userJson._id,
            userName: userJson.email
        };
    },
    getUsers: async ({
                         page = 1,
                         pageSize = 10,
                         isPaging = true,
                         filter = {}
                     }: { filter?: any; page?: number; pageSize?: number; isPaging?: boolean; }) => {
        let users;
        let conditions = {};
        let {name, email, gender, applications, createdAt} = filter;
        if (name){
            conditions['name'] = {'$regex': name};
        }
        if (email){
            conditions['email'] = {'$regex': email};
        }
        if(gender){
            conditions['gender'] = gender;
        }
        if(createdAt){
            let day = new Date(createdAt);
            let nextDay = new Date(createdAt);
            nextDay.setDate(nextDay.getDate() + 1)
            conditions['createdAt'] = {'$gte': day, '$lte': nextDay};
        }
        if(applications){
            if(typeof applications == 'string'){
                conditions['applications'] = {'$in':[`${applications}`]};
            }
            else {
                conditions['applications'] = {$in: applications};
            }
        }

        if (isPaging) {
            const skippedUsers = (page - 1) * pageSize;
            users = await UserModel.find(conditions, {password: 0}).skip(skippedUsers).limit(pageSize);
        } else {
            users = await UserModel.find(conditions, {password: 0});
        }
        console.log(conditions)
        const total = await UserModel.count(conditions);
        const totalPage = isPaging ? Math.ceil(total / pageSize) : 1;
        return {
            result: {
                users: users
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
    updateUser: async (filter, user: any) => {
        await UserModel.findOneAndUpdate(filter, user, {upsert: true});
        return {message: 'Update user success'};
    },
    setPassword: async (args: { userId, password }) => {
        const {userId, password} = args;
        const user = await UserModel.findById(userId);
        const _password = await hashPassword(decodePassword(password));
        if (user) {
            user.password = _password;
            user.save();
            return {message: 'Change password success.'}
        } else {
            throw new BadRequestError({message: 'User is not existed', appStatus: appStatus.LOGIN_ACOUNT_NOT_EXIST})
        }
    }
}