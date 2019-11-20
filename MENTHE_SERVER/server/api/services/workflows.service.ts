

import l from '../../common/logger';
import mongoose from 'mongoose';
import { Workflow, WorkflowSchema, IWorkflow } from '../models/workflows.model';


class InMongoDatabase {

    async createWorkflow(data: IWorkflow) {
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
            company: data.company,
            title: data.title,
            image: data.image,
            xmlcontent: data.xmlcontent,
            createData: Date.now(),
            createBy: data.createDate,
            lastModifiedDate: Date.now(),
            lastModifiedBy: data.lastModifiedBy,
            mode: data.mode,
        });
        l.debug(workflow);
        workflow.save();
        return workflow;
    }

   async findWorkflowById(workflowId:string){
        return await Workflow.findOne({workflow_id: workflowId});
    }

    async findAllWorkflows() {
        return await Workflow.find();
    }

    async deleteWorkflow(id: string) {
        l.debug('Deleting Workflow Id : ', id);
        return await Workflow.findOneAndDelete({workflow_id: id});
    }

    async updateWorkflow(id: string, newWorkflow: IWorkflow) {
        l.debug('Updating Workflow Id : ', id);
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


