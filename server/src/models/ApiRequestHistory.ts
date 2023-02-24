import {Document, model, ObjectId, Schema} from "mongoose";

export const apiRequestHistoryModelName = 'ApiRequestHistory';

class ApiRequestHistory {
    _id: string;
    request: any;
    response: any;
    status: number;
    responseTime: number;
    feedback: string;
    application: string;
    api: string;
    user: string;
    method: string
    apiId: ObjectId;

    constructor(args: any = {}) {
        this._id = args._id;
        this.request = args.requestBody;
        this.response = args.response;
        this.status = args.status;
        this.responseTime = args.responseTime;
        this.feedback = args.message;
        this.user = args.user;
        this.api = args.api;
        this.application = args.application;
        this.method = args.method;
        this.apiId = args.apiId;
    }
}

export interface ApiRequestHistoryDocument extends ApiRequestHistory, Document {
    _id: string;
}

const apiRequestHistorySchema = new Schema<ApiRequestHistoryDocument>({
    request: Schema.Types.Mixed,
    response: Schema.Types.Mixed,
    apiId: Schema.Types.ObjectId,
    method: String,
    status: Number,
    responseTime: Number,
    feedback: String,
    api: String,
    application: String,
    user: String,
}, {
    collection: 'ApiRequestHistory',
    versionKey: false,
    timestamps: true,
});

const ApiRequestHistoryModel = model(apiRequestHistoryModelName, apiRequestHistorySchema);

export default ApiRequestHistoryModel;