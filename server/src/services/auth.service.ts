import {BadRequestError, UnauthorizedError} from '../common/error';
import {default as User, default as UserModel} from "../models/User";
import AccountPendingModel from "../models/AccountPending";
import UserRoleModel from '../models/UserRole';
import UserTokenModel from "../models/UserToken";
import {comparePassword, decodePassword, hashPassword} from '../utils/encryption';
import {signCredentials} from '../utils/jwtHelper';
import * as appStatus from '../common/const/appStatus';
import {v4 as uuidv4} from 'uuid';
import {ObjectId} from "bson";
import {transporter} from "../utils/nodemailer";
import {RegisterRequest} from "../common/request_body/register";
// @ts-ignore
import ForgetPasswordModel from "../models/ForgetPassword";
import redisClient from "../utils/redis";
import {forgetPasswordMail} from "../common/mail/forgetPasswordMail";
import {activeRegisterMail} from "../common/mail/activeRegisterMail";

export const authService = {
    login: async (args: { emailOrAccount: string; password: string }) => {
        const authId = uuidv4();
        const {emailOrAccount, password: _password} = args;
        const user = await UserModel.findOne({$or: [{email: emailOrAccount}, {account: emailOrAccount}]});
        if (!user) throw new UnauthorizedError({data: null, appStatus: appStatus.LOGIN_ACOUNT_NOT_EXIST});

        const password = decodePassword(_password);
        if (!await comparePassword(user.password, password)) throw new UnauthorizedError({
            data: null,
            appStatus: appStatus.LOGIN_WRONG_PASSWORD
        });

        const roles = await UserRoleModel.find({userId: user.id});
        let clientRole = {};
        roles.map((role) => {
            if (clientRole.hasOwnProperty(role.clientName)) {
                clientRole[`${role.clientName}`].push(role.roleName);
            } else {
                clientRole[`${role.clientName}`] = [role.roleName];
            }
        })
        const accessToken = signCredentials({
            credentials: {
                userId: user.id,
                account: user.account || user.email,
                authId: authId
            }, metadata: {clientRole}
        });
        const refreshToken = signCredentials({
            credentials: {
                userId: user.id,
                account: user.account || user.email,
                authId: authId
            }, type: 'refreshToken'
        });

        await UserTokenModel.create({userId: user._id, accessToken, refreshToken, authId});

        return {
            userId: user.id,
            account: user.account || user.email,
            token: accessToken,
            refreshToken
        }
    },

    register: async (data) => {
        const {email} = data;
        console.log(data);
        const exUser = await User.findOne({email: email});
        if (exUser) throw new UnauthorizedError({
            data: null,
            message: 'Email is used!',
            appStatus: appStatus.LOGIN_ACOUNT_IS_USED
        });

        try {
            const user = await UserModel.create(data);
            return {
                userId: user._id,
                email: email
            }
        } catch (error) {
            throw new BadRequestError({
                data: null,
                message: "Register error (Transaction)",
                appStatus: appStatus.UNDEFINED_ERROR
            });
        }
    },
    auth: async (args: { emailOrAccount: string; password: string }) => {
        const {emailOrAccount, password: _password} = args;
        const user = await UserModel.findOne({$or: [{email: emailOrAccount}, {account: emailOrAccount}]});
        if (!user) throw new UnauthorizedError({data: null, appStatus: appStatus.LOGIN_ACOUNT_NOT_EXIST});

        const password = decodePassword(_password);
        if (!await comparePassword(user.password, password)) throw new UnauthorizedError({
            data: null,
            appStatus: appStatus.LOGIN_WRONG_PASSWORD
        });
        const roles = await UserRoleModel.find({userId: user.id});
        let clientRole = {};
        roles.map((role) => {
            if (clientRole.hasOwnProperty(role.clientName)) {
                clientRole[`${role.clientName}`].push(role.roleName);
            } else {
                clientRole[`${role.clientName}`] = [role.roleName];
            }
        })
        const authId = uuidv4();
        const accessToken = signCredentials({
            credentials: {
                userId: user.id,
                account: user.account || user.email,
                authId: authId
            }, metadata: {clientRole}
        });
        const refreshToken = signCredentials({
            credentials: {
                userId: user.id,
                account: user.account || user.email,
                authId: authId
            }, type: 'refreshToken'
        });

        await UserTokenModel.create({accessToken, refreshToken, authId, userId: user.id});

        return {
            userId: user.id,
            email: user.email,
            authId: authId
        }
    },

    logout: async (args: { userId: string; authId?: string }) => {
        // TODO: Redis
        const updates = await UserTokenModel.findOneAndDelete({userId: args.userId, authId: args.authId});
        redisClient.setEx(`blacklist_${args.authId}`, parseInt(String(process.env.BLACKLIST_TOKEN_TTL)), 'true')
        return {message: 'logout success'}
    },

    refreshToken: async (args: { userId: string; userName?: string; authId: string; }) => {
        const user = await UserModel.findById(new ObjectId(args.userId));
        if (!user) throw new UnauthorizedError({data: null, appStatus: appStatus.LOGIN_ACOUNT_NOT_EXIST});
        const roles = await UserRoleModel.find({userId: user.id});
        let clientRole = {};
        roles.map((role) => {
            if (clientRole.hasOwnProperty(role.clientName)) {
                clientRole[`${role.clientName}`].push(role.roleName);
            } else {
                clientRole[`${role.clientName}`] = [role.roleName];
            }
        })
        const accessToken = signCredentials({
            credentials: {
                userId: args.userId,
                authId: args.authId,
                account: user.account || user.email
            }, metadata: {clientRole}
        });
        await UserTokenModel.findOneAndUpdate({userId: args.userId, authId: args.authId}, {accessToken: accessToken});
        return accessToken;
    },

    getAccessToken: async (args: { userId: string; authId: string; }) => {
        const userToken = await UserTokenModel.findOne({userId: args.userId, authId: args.authId});
        return userToken?.get("accessToken") ?? '';
    },

    getRefreshToken: async (args: { userId: string; authId: string; }) => {
        const userToken = await UserTokenModel.findOne({userId: args.userId, authId: args.authId});
        return userToken?.get("refreshToken") ?? '';
    },

    getTokenWithAuthId: async (args: { userId: string, authId: string }) => {
        const userToken = await UserTokenModel.findOne({userId: args.userId, authId: args.authId});
        return {
            accessToken: userToken?.get("accessToken") ?? '',
            refreshToken: userToken?.get("refreshToken") ?? ''
        };
    },

    verifyByGmail: async (data: RegisterRequest) => {

        const exUser = await User.findOne({email: data.email});
        if (exUser) throw new UnauthorizedError({
            data: null,
            message: 'Email is used!',
            appStatus: appStatus.REGISTER_MAIL_IS_USED
        });

        const pendingAccount = await AccountPendingModel.findOne({email: data.email});
        if (pendingAccount) throw new UnauthorizedError({
            data: null,
            message: 'Email is pending!',
            appStatus: appStatus.REGISTER_MAIL_IS_PENDING
        });
        const dateOfBirth = new Date(data.dateOfBirth);
        const expirationDate = new Date(Date.now() + 1000 * 3600)
        const hashedPassword = await hashPassword(decodePassword(data.password))
        const acc = await AccountPendingModel.create({
            ...data,
            password: hashedPassword,
            dateOfBirth: dateOfBirth,
            expirationDate: expirationDate
        });

        let mailOptions = {
            from: "VAIPE SYSTEM",
            to: data.email,
            subject: "Xác thực đăng ký tài khoản Vaipe",
            // HTML body
            // html: `Click vào <a href='${process.env.SSO_URL}/auth/active?_id=${acc._id}'>link</a> để hoàn thành xác thực email`,
            html: `${activeRegisterMail(acc.id)}`
        };
        try {
            await transporter.sendMail(mailOptions);
            return {
                message: 'Please check your gmail',
            }
        } catch (error) {
            await AccountPendingModel.deleteOne({ email: data.email });
            throw new BadRequestError({message:`Error when send mail ${error}`})
        }

    },

    active: async (_id) => {
        const pendingAccount = await AccountPendingModel.findById(_id, {_id: 0, createdAt: 0, updatedAt: 0}).lean();
        if (!pendingAccount) {
            throw new BadRequestError();
        } else {
            const {expirationDate} = pendingAccount;
            if (expirationDate.valueOf() < Date.now()) {
                await AccountPendingModel.findByIdAndDelete(_id);
                throw new BadRequestError({message: 'Request expired', appStatus: appStatus.REQUEST_EXPIRED});
            } else {
                await AccountPendingModel.findByIdAndDelete(_id);
                const {expirationDate, ...data} = pendingAccount;
                await UserModel.create(data);
                return true;
            }
        }
    },

    changePassword: async (args: { userId: string, password: string, newPassword: string }) => {
        const _password = decodePassword(args.password);
        const user = await UserModel.findById(args.userId);
        if (!user || !await comparePassword(user.password, _password))
            throw new BadRequestError({message: 'Password is incorrect', appStatus: appStatus.LOGIN_WRONG_PASSWORD});
        else {
            const password = await hashPassword(decodePassword(args.newPassword));
            user.password = password;
            user.save();
        }
        return {message: 'Change password success.'}
    },

    forgetPassword: async (args: { email: string }) => {
        const {email} = args;
        const exUser = await User.findOne({email: email});
        if (!exUser) throw new BadRequestError({
            message: 'Email is not registered.',
            appStatus: appStatus.EMAIL_IS_NOT_REGISTERED
        });
        else {
            await ForgetPasswordModel.deleteMany({email: email});
            const session = await ForgetPasswordModel.create({
                email: email,
                expirationDate: new Date(Date.now() + 1000 * 3600)
            });
            let mailOptions = {
                from: "VAIPE SYSTEM",
                to: email,
                subject: "Đặt lại mật khẩu",
                html: `${forgetPasswordMail(session._id)}`
            };
            try {
                await transporter.sendMail(mailOptions);
                return {
                    message: 'Please check your gmail',
                }
            } catch (error) {
                await ForgetPasswordModel.deleteOne({ email: email });
                throw new BadRequestError({message:'Sorry. Something error when send mail', appStatus: appStatus.SEND_MAIL_ERROR});
            }

        }
    },

    setPassword: async (args: { _id, password }) => {
        const {_id, password} = args;
        const session = await ForgetPasswordModel.findById(_id);
        if (!session) {
            throw new BadRequestError({message: 'Reset password request not found'});
        } else {
            const {email, expirationDate, ...other} = session;
            if (expirationDate.valueOf() < Date.now()) {
                ForgetPasswordModel.findByIdAndDelete(_id);
                throw new BadRequestError({message: 'Reset password request expired'});
            } else {
                const user = await UserModel.findOne({email: email});
                const _password = await hashPassword(decodePassword(password));
                if (user) {
                    user.password = _password;
                    user.save();
                }
                ForgetPasswordModel.findByIdAndDelete(_id);
            }

        }
        return {message: 'Change password success.'}
    },

    logOutAll: async (args: { userId: string; }) => {
        const filter = {userId: new ObjectId(args.userId)}
        const listActiveSession = await UserTokenModel.find(filter)
        await UserTokenModel.deleteMany(filter);
        listActiveSession.forEach((activeSession) => {
            redisClient.setEx(`blacklist_${activeSession.authId}`, parseInt(String(process.env.BLACKLIST_TOKEN_TTL)), 'true')
        })
        return {message: 'logout all success'}
    }
};

export default authService;