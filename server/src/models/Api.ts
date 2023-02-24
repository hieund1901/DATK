import {Document, model, Schema} from "mongoose";

export const apiModelName = 'Api';

class Api {
    _id: string;
    host: string;
    name: string;
    path: string;
    packages: any;

    constructor(args: any = {}) {
        this._id = args._id;
        this.host = args.host;
        this.name = args.name;
        this.path = args.path;
        this.packages = args.packages;
    }
}

export interface ApiDocument extends Api, Document {
    _id: string;
}

const apiSchema = new Schema<ApiDocument>({
    host: String,
    path: String,
    name: String,
    packages: Schema.Types.Mixed

}, {
    collection: 'Api',
    versionKey: false,
    timestamps: true,
});

const ApiModel = model(apiModelName, apiSchema);

export default ApiModel;