import { Model, Schema, Document, model } from 'mongoose';

export  enum ProcessState {
    RUNNING,
    WAITING,
    STOPPED,
    LOADING,
}

export interface IProcess {
    processId: string;
    workflowId: string;
    state: ProcessState;
    name: string;
}
export interface IProcessModel extends IProcess, Document {}

export const ProcessSchema: Schema = new Schema({
    processId: String,
    workflowId: String,
    state: Number,
    name: String,
})

export const Process: Model<IProcessModel> = model<IProcessModel>("Processes", ProcessSchema)