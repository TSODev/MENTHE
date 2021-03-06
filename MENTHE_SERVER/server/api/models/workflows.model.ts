import { Model, Schema, Document, model } from 'mongoose';

export enum stateType {
    ACTIVE,
    INACTIVE,
    DELETED,
};

export enum statusType {
    WAITING = 1000,
    READY = 20000,
    RUNNING = 3000,
    STOPPED = 4000,
    PAUSED = 5000,
    CANCELED = 7000,
    ERROR = 9000,
    COMPLETED = 6000,
    UNKNOW = 1,
};

export interface IWorkflow {
    workflow_id: string,
    domain: string,
    company: string,
    title: string,
    description: string,
    state: stateType,
    status: statusType,
    image: string,
    xmlcontent: string,
    readonly: boolean,
    createDate: Date,
    createdBy: string,
    lastModifiedDate: Date,
    lastModifiedBy: string,
    mode: string,
}

export interface IWorkflowModel extends IWorkflow, Document {}

export const WorkflowSchema: Schema = new Schema({
    workflow_id: String,
    domain: String,
    company: String,
    title: String,
    description: String,
    image: String,
    state: Number,
    status: Number,
    xmlcontent: String,
    readonly: Boolean,
    createDate: Date,
    createdBy: String,
    lastModifiedDate: Date,
    lastModifiedBy: String,
    mode: String,
});


export const Workflow: Model<IWorkflowModel> = model<IWorkflowModel>("Workflow", WorkflowSchema)