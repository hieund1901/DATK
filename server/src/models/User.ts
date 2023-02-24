import {Document, model, Schema} from "mongoose";

export const userModelName = 'User';

class User {
    _id: string;
    name: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    avatar: string;
    gender: string;
    account: string;
    applications: [string];

    constructor(args: any = {}) {
        this._id = args._id;
        this.name = args.name;
        this.email = args.email;
        this.password = args.password;
        this.dateOfBirth = args.dateOfBirth;
        this.avatar = args.avatar;
        this.gender = args.gender;
        this.account = args.account
        this.applications = args.applications;
    }
}

export interface UserDocument extends User, Document {
    _id: string;
}

const userSchema = new Schema<UserDocument>({
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    avatar: String,
    gender: String,
    account: String,
    applications: [String]
}, {
    collection: 'User',
    versionKey: false,
    timestamps: true,
});

const UserModel = model(userModelName, userSchema);

export default UserModel;