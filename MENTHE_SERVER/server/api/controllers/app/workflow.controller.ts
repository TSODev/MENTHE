import { Request, Response } from 'express';

import { db } from '../../services/workflows.service';
import l from '../../../common/logger';

import { IWorkflow } from '../../models/workflows.model';

export class workflowControler {

    async allWorkflows(req: Request, res:Response){
        const workflows = await db.findAllWorkflows();
        res.status(200).json({workflows: workflows});
    }

    async createWorkflow(req: Request, res: Response): Promise<void> {
        const workflow_data = req.body;
        l.debug('Create Workflow : ', workflow_data);
        try {
            const workflow = await db.createWorkflow(workflow_data);
            res.status(200).json({workflow: workflow});
        } catch (error) {
            res.status(500).json({error: "Workflow already exist in database"});
        }
    }

    async getWorkflow(req: Request, res: Response){
        l.debug("looking for workflow (id): ",req['workflowId']);
        const workflow: IWorkflow = await db.findWorkflowById(req["workflowId"].sub);
        if (workflow) {
            res.status(200).json({workflow: workflow});
        } else {
            res.sendStatus(204);
        }
    }

    async getWorkflowById(req: Request, res: Response){
        const id = req.params['id'];
        l.debug("looking for workflowId: ", id);
        const workflow = await db.findWorkflowById(id);
        if (workflow) {
          res.status(200).json({workflow: workflow});
        } else {
          res.sendStatus(204);
        }
      }
 
      async deleteWorkflow(req: Request, res:Response){
        l.debug('Request for delete workflowId:', req.params.id);
        const workflow = await db.deleteWorkflow(req.params.id)
          .catch(err => res.sendStatus(500));
        res.sendStatus(204);
      }

      async updateWorkflow(req: Request, res:Response){
        l.debug('Request for update workflowId:', req.params.id);
        const workflow = await db.updateWorkflow(req.params.id, req.body)
          .catch(err => res.sendStatus(500));
        res.sendStatus(204);
      }
}

export default new workflowControler();