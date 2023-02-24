import {Document, model, Schema} from "mongoose";

export const clientModelName = 'Client';

class Client {
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

export interface ClientDocument extends Client, Document {
    _id: string;
}

const clientSchema = new Schema<ClientDocument>({
    name: String,
    description: String,
    functions: Schema.Types.Array
}, {
    collection: 'Client',
    versionKey: false,
    timestamps: true,
});

const ClientModel = model(clientModelName, clientSchema);

export default ClientModel;