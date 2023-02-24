import {Document, model, ObjectId, Schema} from "mongoose";

export const applicationApiModelName = 'ApplicationApi';

class ApplicationApi {
    _id: string;
    appId: ObjectId;
    apiId: ObjectId;
    quota: number;
    package: string;
    successRequest: number;
    failRequest: number;
    remainingAmount: number;
    key: string


    constructor(args: any = {}) {
        this._id = args._id;
        this.appId = args.appId;
        this.apiId = args.apiId;
        this.quota = args.quota;
        this.package = args.package;
        this.successRequest = args.successRequest;
        this.failRequest = args.failRequest;
        this.remainingAmount = args.remainingAmount;
        this.key = args.key;
    }
}

export interface ApplicationApiDocument extends ApplicationApi, Document {
    _id: string;
}

const applicationApiSchema = new Schema<ApplicationApiDocument>({
    appId: Schema.Types.ObjectId,
    apiId: Schema.Types.ObjectId,
    quota: Number,
    package: String,
    successRequest: Number,
    failRequest: Number,
    remainingAmount: Number,
    key: String
}, {
    collection: 'ApplicationApi',
    versionKey: false,
    timestamps: true,
});

const ApplicationApiModel = model(applicationApiModelName, applicationApiSchema);

export default ApplicationApiModel;