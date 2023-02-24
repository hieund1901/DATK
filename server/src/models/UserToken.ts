import {Document, model, Schema, Types} from "mongoose";
import {userModelName} from "./User";

export const userTokenModelName = 'UserToken';

class UserToken {
    _id: string;
    userId: any;
    accessToken: string;
    refreshToken: string;
    authId: string;

    constructor(args: any = {}) {
        this._id = args._id;
        this.userId = args.userId;
        this.accessToken = args.accessToken;
        this.refreshToken = args.refreshToken;
        this.authId = args.authId;
    }
}

export interface UserTokenDocument extends UserToken, Document {
    _id: string;
}

const userTokenSchema = new Schema<UserTokenDocument>({
    userId: {
        type: Types.ObjectId,
        ref: userModelName
    },
    accessToken: String,
    refreshToken: String,
    authId: String
}, {
    versionKey: false,
    timestamps: true,
    collection: 'UserToken'
});

const UserTokenModel = model(userTokenModelName, userTokenSchema);

export default UserTokenModel;