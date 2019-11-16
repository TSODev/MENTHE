import { Model, Schema, Document, model } from 'mongoose';

export interface IWorkflow {
    workflow_id: string,
    domain: string,
    company: string,
    title: string,
    image: string,
    xmlcontent: string,
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
    image: String,
    xmlcontent: String,
    createDate: Date,
    createdBy: String,
    lastModifiedDate: Date,
    lastModifiedBy: String,
    mode: String,
});


export const Workflow: Model<IWorkflowModel> = model<IWorkflowModel>("Workflow", WorkflowSchema)