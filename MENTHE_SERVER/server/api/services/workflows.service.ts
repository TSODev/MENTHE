

import l from '../../common/logger';
import mongoose from 'mongoose';
import { Workflow, WorkflowSchema, IWorkflow } from '../models/workflows.model';
import { IUser } from '../models/users.model';
import { dbUser } from './user.service';
import * as _ from 'lodash';


class InMongoDatabase {

    isAdmin(user: IUser) {
        return ((_.intersection(user.roles, ['ADMIN'])).length > 0);
      }

    async createWorkflow(data: IWorkflow, by: IUser) {
        const workflowPerId = await db.findWorkflowById(data.workflow_id)
           if (workflowPerId) {
               const message = "This Workflow id already exist in database";
                l.error(message);
                throw new Error(message);
           } 
        const id = this.uuidv4();

        let workflow = new Workflow({
            workflow_id: id,
            domain: data.domain,
            company: by.company,
            title: data.title,
            description: data.description,
            state: data.state,
            status: data.status,
            image: data.image,
            xmlcontent: data.xmlcontent,
            readonly: data.readonly,
            createDate: Date.now(),
            createdBy: by.user_id,
            lastModifiedDate: Date.now(),
            lastModifiedBy: by.user_id,
            mode: data.mode,
        });
        l.debug('Create : ',workflow);
        workflow.save();
        return workflow;
    }

   async findWorkflowById(workflowId: string){
        return await Workflow.findOne({workflow_id: workflowId});
    }

    async findAllWorkflows() {
        return await Workflow.find();
    }

    async findAllWorkflowsForTenant(userId: string) {
        const user = await dbUser.findUserById(userId);
        if (this.isAdmin(user)){
            return await Workflow.find();
        } else {
            return await Workflow.find({company: user.company});
        }
    }

    async deleteWorkflow(id: string) {
        l.debug('Deleting Workflow Id : ', id);
        return await Workflow.findOneAndDelete({workflow_id: id});
    }

    async updateWorkflow(id: string, newWorkflow: IWorkflow, by: IUser) {
        l.debug('Updating Workflow Id : ', id);
        newWorkflow.lastModifiedBy = by.user_id;
        newWorkflow.lastModifiedDate = new Date();
        return await Workflow.findOneAndUpdate({workflow_id: id},newWorkflow);
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}


export const db = new InMongoDatabase();


