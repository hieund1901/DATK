import {Document, model, ObjectId, Schema} from "mongoose";

export const roleModelName = 'Role';

class Role {
    _id: string;
    name: string;
    description: string;
    clientId: ObjectId;
    clientName: string;
    functions: any;

    constructor(args: any = {}) {
        this._id = args._id;
        this.name = args.name;
        this.description = args.description;
        this.clientId = args.clientId;
        this.clientName = args.clientName;
        this.functions = args.functions;
    }
}

export interface RoleDocument extends Role, Document {
    _id: string;
}

const roleSchema = new Schema<RoleDocument>({
    name: String,
    description: String,
    clientId: Schema.Types.ObjectId,
    functions: Schema.Types.Array,
    clientName: String
}, {
    collection: 'Role',
    versionKey: false,
    timestamps: true,
});

const RoleModel = model(roleModelName, roleSchema);

export default RoleModel;