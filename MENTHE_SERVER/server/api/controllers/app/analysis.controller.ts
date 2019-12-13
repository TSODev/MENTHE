import { Request, Response } from 'express';
import { analysis } from "../../services/analysis.service";
import l from '../../../common/logger';
import { IUser } from '../../models/users.model';
import { dbUser } from '../../services/user.service';
import { dbWorkFlow } from '../../services/workflows.service';

export class AnalysisController {

    async getWorkflowData(req: Request, res: Response) {
        const data = await analysis.getWorkFlowData(req.params.id);
        res.status(200).json({data: data});

    }

    async analyseData(req: Request, res: Response) {
        const data = await analysis.analyseData(req.params.id);
        res.status(200).json({elementList: data});
    }

    async createPublication(req: Request, res: Response) {
        const publication = req.body;
        const userId = req['userId'];
        l.debug('Create Publication by : ', userId);
//        l.debug('Create Workflow : ', workflow_data);
        try {
          const user: IUser = await dbUser.findUserById(userId.sub);
          try {
              const workflow = await analysis.createPublication(publication, user);
              res.status(200).json({workflow: workflow});
          } catch (error) {
              res.status(500).json({error: "Publication already exist in database"});
          }
        } catch (err) {
            res.status(500).json({ error: "Error when creating workflow"})
        }
    }

    // async getParticipant(req: Request, res: Response) {
    //     const participant = await analysis.getParticipant(req.params.id);
    //     res.status(200).json({participant: participant});
    // }

    // async getProcesses(req: Request, res: Response) {
    //     const processes = await analysis.getProcesses(req.params.id);
    //     res.status(200).json({processes: processes});        
    // }

    // async getProcess(req: Request, res: Response) {
    //     analysis.getProcess(req.params.wid, req.params.pid)
    //     .then(process => res.status(200).json({process: process}))
    //     .catch(err => res.status(500));
    // }

    // async getStartEvents(req: Request, res: Response) {
    //     const startEvents = await analysis.getStartEvents(req.params.id);
    //     res.status(200).json({startEvents: startEvents});        
    // }

    // async getStartEvent(req: Request, res: Response) {
    //     analysis.getStartEvent(req.params.wid, req.params.pid)
    //     .then(startEvent => res.status(200).json({startEvent: startEvent}))
    //     .catch(err => res.status(500));
    // }

    // async getEndEvents(req: Request, res: Response) {
    //     const endEvents = await analysis.getEndEvents(req.params.id);
    //     res.status(200).json({endEvents: endEvents});        
    // }

    // async getEndEvent(req: Request, res: Response) {
    //     analysis.getEndEvent(req.params.wid, req.params.pid)
    //     .then(endEvent => res.status(200).json({endEvent: endEvent}))
    //     .catch(err => res.status(500));
    // }
}

export default new AnalysisController();