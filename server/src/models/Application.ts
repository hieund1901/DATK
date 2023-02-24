import {Document, model, Schema} from "mongoose";

export const applicationModelName = 'Application';

class Application {
    _id: string;
    name: string;
    description: string;
    functions: any = [];

    constructor(args: any = {}) {
        this._id = args._id;
        this.name = args.name;
        this.description = args.description;
        this.functions = args.functions;
    }
}

export interface ApplicationDocument extends Application, Document {
    _id: string;
}

const applicationSchema = new Schema<ApplicationDocument>({
    name: String,
    description: String,
    functions: Schema.Types.Array
}, {
    collection: 'Application',
    versionKey: false,
    timestamps: true,
});

const ApplicationModel = model(applicationModelName, applicationSchema);

export default ApplicationModel;