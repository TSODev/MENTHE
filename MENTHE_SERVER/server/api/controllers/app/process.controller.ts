import { Request, Response } from 'express';

import { db } from '../../services/process.service';
import l from '../../../common/logger';

import { IProcess } from '../../models/process.model';
import { dbUser } from '../../services/user.service';
import { IUser } from '../../models/users.model'

export class processControler {

    async allProcesses(req: Request, res:Response){
        const processs = await db.findAllProcesss();
        res.status(200).json({processs: processs});
    }

    async createProcess(req: Request, res: Response): Promise<void> {
        const process_data = req.body;
        const userId = req['userId'];
        l.debug('Create Process by : ', userId);
//        l.debug('Create Process : ', process_data);
        try {
          const user: IUser = await dbUser.findUserById(userId.sub);
          try {
              const process = await db.createProcess(process_data, user);
              res.status(200).json({process: process});
          } catch (error) {
              res.status(500).json({error: "Process already exist in database"});
          }
        } catch (err) {
            res.status(500).json({ error: "Error when creating process"})
        }

    }

    async getProcess(req: Request, res: Response){
        l.debug("looking for process (id): ",req['processId']);
        const process: IProcess = await db.findProcessById(req["processId"].sub);
        if (process) {
            res.status(200).json({process: process});
        } else {
            res.sendStatus(204);
        }
    }

    async getProcessById(req: Request, res: Response){
        const id = req.params['id'];
        l.debug("looking for processId: ", id);
        const process = await db.findProcessById(id);
        if (process) {
          res.status(200).json({process: process});
        } else {
          res.sendStatus(204);
        }
      }
 
      async deleteProcess(req: Request, res:Response){
        l.debug('Request for delete processId:', req.params.id);
        const process = await db.deleteProcess(req.params.id)
          .catch(err => res.sendStatus(500));
        res.sendStatus(204);
      }

      async updateProcess(req: Request, res:Response){
        const userId = req['userId'];
        const user: IUser = await dbUser.findUserById(userId.sub);
        l.debug('Request for update processId:', req.params.id);
        const process = await db.updateProcess(req.params.id, req.body, user)
          .catch(err => res.sendStatus(500));
        res.sendStatus(204);
      }
}

export default new processControler();