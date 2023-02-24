import {BadRequestError} from '../common/error';
import UserModel from "../models/User";
import * as appStatus from '../common/const/appStatus';
import {getFile, uploadFile} from '../utils/storage';
import ForgetPasswordModel from "../models/ForgetPassword";
import {decodePassword, hashPassword} from "../utils/encryption";

export default {
    getUser: async (args: { userId: string }) => {
        const {userId} = args;

        const user = await UserModel.findOne({_id: userId}, '-password').exec();
        if (!user) throw new BadRequestError({data: null, appStatus: appStatus.USER_NOT_EXISTED});

        let userJson = user.toJSON();
        if (!userJson.avatar) {
            userJson.avatar = '';
        }

        return {
            ...userJson,
            userId: userJson._id,
            userName: userJson.email
        };
    },
    updateUser: async (filter, user: any) => {
        await UserModel.findOneAndUpdate(filter, user, {upsert: true});
        return {message: 'Update user success'};
    },
    uploadAvatar: async (image, userId) => {
        uploadFile('avatar', `${userId}.jpg`, image.buffer);
        const user = await UserModel.findOneAndUpdate({_id: userId}, {avatar: `${process.env.SERVER_URL}/users/${userId}/avatar`}, {upsert: true});
        return user;
    },
    getAvatar: async (userId) => {
        return getFile('avatar', `${userId}.jpg`);
    }

}