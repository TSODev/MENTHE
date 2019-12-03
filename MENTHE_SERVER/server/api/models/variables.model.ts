import { Model, Schema, Document, model } from 'mongoose';

export interface IVariable {
    variable_id: string,
    workflow_id: string,
    name: string,
    defaultValue: string,
    type: string,
    direction: string,
}
export interface IVariableModel extends IVariable, Document {}

export const VariableSchema: Schema = new Schema({
    variable_id: String,
    workflow_id: String,
    name: String,
    defaultValue: String,
    type: String,
    direction: String,
})

export const Variable: Model<IVariableModel> = model<IVariableModel>("Variable", VariableSchema)