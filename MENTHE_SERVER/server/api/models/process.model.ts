import { Model, Schema, Document, model } from 'mongoose';

export interface IProcess {
    process_id: string;
    name: string;
}
export interface IProcessModel extends IProcess, Document {}

export const ProcessSchema: Schema = new Schema({
    process_id: String,
    name: String,
})

export const Process: Model<IProcessModel> = model<IProcessModel>("Processes", ProcessSchema)