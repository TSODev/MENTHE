import { Model, Schema, Document, model } from 'mongoose';

export interface IGroup {
    group_id: string,
    groupemail: string,
    company: string,
    groupname: string,
    description: string,
    roles: string[],
    createdDate: Date
}

export interface IGroupModel extends IGroup, Document{
}

export const GroupSchema: Schema = new Schema({
    group_id: String,
    groupemail: String,
    company: String,
    groupname: String,
    description: String,
    roles: [String],
    createDate: Date
});

//>>> This is the one that export the Group Model
export const Group: Model<IGroupModel> = model<IGroupModel>("Group", GroupSchema)