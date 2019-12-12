import { Request, Response } from 'express';

import { dbWorkFlow } from '../../services/workflows.service';
import l from '../../../common/logger';

import { IWorkflow } from '../../models/workflows.model';
import { dbUser } from '../../services/user.service';
import { IUser } from '../../models/users.model'

export class workflowControler {

    async getConnectedUser(req: Request): Promise<IUser> {
      return dbUser.findUserById(req['userId']);
    }

    async allWorkflows(req: Request, res:Response){
        const workflows = await dbWorkFlow.findAllWorkflows();
        res.status(200).json({workflows: workflows});
    }

    async getAllWorkflowByTenant(req:Request, res:Response){
      const workflows = await dbWorkFlow.findAllWorkflowsForTenant(req['userId'].sub);
      res.status(200).json({workflows: workflows});
    }

    async createWorkflow(req: Request, res: Response): Promise<void> {
        const workflow_data = req.body;
        const userId = req['userId'];
        l.debug('Create Workflow by : ', userId);
//        l.debug('Create Workflow : ', workflow_data);
        try {
          const user: IUser = await dbUser.findUserById(userId.sub);
          try {
              const workflow = await dbWorkFlow.createWorkflow(workflow_data, user);
              res.status(200).json({workflow: workflow});
          } catch (error) {
              res.status(500).json({error: "Workflow already exist in database"});
          }
        } catch (err) {
            res.status(500).json({ error: "Error when creating workflow"})
        }

    }

    // async getWorkflow(req: Request, res: Response){
    //     l.debug("looking for workflow (id): ",req['workflowId']);
    //     const workflow: IWorkflow = await dbWorkFlow.findWorkflowById(req["workflowId"].sub);
    //     if (workflow) {
    //         res.status(200).json({workflow: workflow});
    //     } else {
    //         res.sendStatus(204);
    //     }
    // }

    async getWorkflowById(req: Request, res: Response){
        const id = req.params['id'];
        l.debug("looking for workflowId: ", id);
        const workflow = await dbWorkFlow.findWorkflowById(id);
        if (workflow) {
          res.status(200).json({workflow: workflow});
        } else {
          res.sendStatus(204);
        }
      }
 
      async deleteWorkflow(req: Request, res:Response){
        l.debug('Request for delete workflowId:', req.params.id);
        const workflow = await dbWorkFlow.deleteWorkflow(req.params.id)
          .catch(err => res.sendStatus(500));
        res.sendStatus(204);
      }

      async updateWorkflow(req: Request, res:Response){
        const userId = req['userId'];
        const user: IUser = await dbUser.findUserById(userId.sub);
        l.debug('Request for update workflowId:', req.params.id);
        const workflow = await dbWorkFlow.updateWorkflow(req.params.id, req.body, user)
          .catch(err => res.sendStatus(500));
        res.sendStatus(204);
      }
}

export default new workflowControler();