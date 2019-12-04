import { Request, Response } from 'express';

import { db } from '../../services/variable.service';
import l from '../../../common/logger';

import { IVariable } from '../../models/variables.model';
import { dbUser } from '../../services/user.service';
import { IUser } from '../../models/users.model'

export class variableControler {

    async allVariables(req: Request, res:Response){
        const variables = await db.findAllVariables();
        res.status(200).json({variables: variables});
    }

    async createVariable(req: Request, res: Response): Promise<void> {
        const variable_data = req.body;
        const userId = req['userId'];
        l.debug('Create Variable by : ', userId);
        l.debug('Create Variable : ', variable_data);
        try {
          const user: IUser = await dbUser.findUserById(userId.sub);
          try {
              const variable = await db.createVariable(variable_data);
              res.status(200).json({variable: variable});
          } catch (error) {
              res.status(500).json({error: "Variable already exist in database"});
          }
        } catch (err) {
            res.status(500).json({ error: "Error when creating variable"})
        }

    }

    async getVariable(req: Request, res: Response){
        l.debug("looking for variable (id): ",req['variableId']);
        const variable: IVariable = await db.findVariableById(req["variableId"].sub);
        if (variable) {
            res.status(200).json({variable: variable});
        } else {
            res.sendStatus(204);
        }
    }

    async getVariableById(req: Request, res: Response){
        const id = req.params['id'];
        l.debug("looking for variableId: ", id);
        const variable = await db.findVariableById(id);
        if (variable) {
          res.status(200).json({variable: variable});
        } else {
          res.sendStatus(204);
        }
      }

      async getVariableByProcessId(req: Request, res: Response){
          const id = req.params['id'];
          l.debug("looking for All Variable in Workflow Id: ", id);
          const variables: IVariable[] = await db.findVariableByProcessId(id);
          if (variables) {
              res.status(200).json({variables: variables});
          } else {
              res.sendStatus(204);
          }
      }
 
      async deleteVariable(req: Request, res:Response){
        l.debug('Request for delete variableId:', req.params.id);
        const variable = await db.deleteVariable(req.params.id)
          .catch(err => res.sendStatus(500));
        res.sendStatus(204);
      }

      async updateVariable(req: Request, res:Response){
        const userId = req['userId'];
        const user: IUser = await dbUser.findUserById(userId.sub);
        l.debug('Request for update variableId:', req.params.id);
        const variable = await db.updateVariable(req.params.id, req.body)
          .catch(err => res.sendStatus(500));
        res.sendStatus(204);
      }
}

export default new variableControler();