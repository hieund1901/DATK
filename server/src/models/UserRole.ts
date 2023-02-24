import {Document, model, ObjectId, Schema} from "mongoose";

export const userRoleModelName = 'UserRole';

class UserRole {
    _id: string;
    roleId: ObjectId;
    userId: ObjectId;
    clientId: ObjectId;
    clientName: string;
    roleName: string;


    constructor(args: any = {}) {
        this._id = args._id;
        this.roleId = args.roleId;
        this.userId = args.userId;
        this.clientId = args.clientId;
        this.clientName = args.clientName;
        this.roleName = args.roleName;
    }
}

export interface UserRoleDocument extends UserRole, Document {
    _id: string;
}

const userRoleSchema = new Schema<UserRoleDocument>({
    roleId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    clientId: Schema.Types.ObjectId,
    clientName: String,
    roleName: String
}, {
    collection: 'UserRole',
    versionKey: false,
    timestamps: true,
});

const UserRoleModel = model(userRoleModelName, userRoleSchema);

export default UserRoleModel;