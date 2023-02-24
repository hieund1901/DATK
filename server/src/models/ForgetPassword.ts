import {Document, model, Schema} from "mongoose";

export const forgetPasswordModelName = 'ForgetPassword';

class ForgetPassword {
    _id: string;
    email: string;
    expirationDate: Date

    constructor(args: any = {}) {
        this._id = args._id;
        this.email = args.email;
        this.expirationDate = args.expirationDate;
    }
}

export interface ForgetPasswordDocument extends ForgetPassword, Document {
    _id: string;
}

const forgetPasswordSchema = new Schema<ForgetPasswordDocument>({
    email: String,
    expirationDate: Date,
}, {
    collection: 'ForgetPassword',
    versionKey: false,
    timestamps: true,
});

const ForgetPasswordModel = model(forgetPasswordModelName, forgetPasswordSchema);

export default ForgetPasswordModel;