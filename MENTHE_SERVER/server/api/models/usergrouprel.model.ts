import { Model, Schema, Document, model } from 'mongoose';

export interface IUserGroup {
    group_id:   string;
    user_id: string;
}

export interface IUserGroupModel extends IUserGroup, Document{
}

export const UserGroupSchema: Schema = new Schema({
    group_id: String,
    user_id: String,
});


//>>> This is the one that export the UserGroup Model
export const UserGroup: Model<IUserGroupModel> = model<IUserGroupModel>("UserGroup", UserGroupSchema)