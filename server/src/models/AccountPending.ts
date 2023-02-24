import {Document, model, Schema} from "mongoose";

export const accountPendingModelName = 'AccountPending';

class AccountPending {
    _id: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    gender: string;
    name: string;
    expirationDate: Date

    constructor(args: any = {}) {
        this._id = args._id;
        this.name = args.name;
        this.email = args.email;
        this.password = args.password;
        this.expirationDate = args.expirationDate;
        this.dateOfBirth = args.dateOfBirth;
    }
}

export interface AccountPendingDocument extends AccountPending, Document {
    _id: string;
}

const accountPendingSchema = new Schema<AccountPendingDocument>({
    name: String,
    email: String,
    password: String,
    expirationDate: {
        type: Date,
        default: new Date(Date.now() + 1000 * 3600),
    },
    dateOfBirth: Date,
    gender: String
}, {
    collection: 'AccountPending',
    versionKey: false,
    timestamps: true,
});

const AccountPendingModel = model(accountPendingModelName, accountPendingSchema);

export default AccountPendingModel;