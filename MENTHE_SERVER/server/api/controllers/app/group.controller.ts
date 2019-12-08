//import GroupService from '../../services/groups.service';
import { Request, Response } from 'express';

import { dbGroup } from '../../services/group.service';
import l from '../../../common/logger';
import { Group, IGroup } from '../../models/groups.model';
import { dbUser } from '../../services/user.service';


export class groupController {

  async allGroups(req: Request, res: Response) {
    if (!dbUser.dbConnected) res.sendStatus(500);
    const groups = await dbGroup.findAllGroups();
    res.status(200).json({groups: groups});
  }

  async createGroup(req: Request, res: Response): Promise<void> {
    const group = req.body;
    l.debug('Create Group : ', group);
    try {
        const article = await dbGroup.createGroup(group);
        res.status(200).json({group: group});
    } catch (error) {
        res.status(500).json({error: "Group already exist in database"});
    }
}

  async getGroup(req: Request, res: Response) {
    if (!dbGroup.dbConnected) res.sendStatus(500);
    l.debug("looking for current Group (id): ", req["groupId"]);
    const group = await dbGroup.findGroupById(req["groupId"].sub);

    if (group) {
      res.status(200).json({group: group});
    } else {
      res.sendStatus(204);
    }
  }

  async getGroupById(req: Request, res: Response){
    if (!dbGroup.dbConnected) res.sendStatus(500);
    const id = req.params['id'];
    l.debug("looking for groupId: ", id);
    const group = await dbGroup.findGroupById(id);
    if (group) {
      res.status(200).json({group: group});
    } else {
      res.sendStatus(204);
    }
  }

  async getGroupByEmail(req: Request, res: Response){
    if (!dbGroup.dbConnected) res.sendStatus(500);
    const groupemail = req.params['groupemail'];
    l.debug("looking for group email: ", groupemail);
    const group = await dbGroup.findGroupByEmail(groupemail);
    if (group) {
      res.status(200).json({group: group});
    } else {
      res.sendStatus(500);
    }
  }

  async getGroupByName(req: Request, res: Response) {
    if (!dbGroup.dbConnected) res.sendStatus(500);
    const groupname = req.params['groupname'];
    l.debug("looking for group name: ", name);
    const group = await dbGroup.findGroupByName(groupname);
    if (group) {
      res.status(200).json({group: group});
    } else {
      res.sendStatus(500);
    }    
  }

  async deleteGroup(req: Request, res:Response){
    if (!dbGroup.dbConnected) res.sendStatus(500);
    l.debug('Request for delete groupId:', req.params.id);
    const group = await dbGroup.deleteGroup(req.params.id)
      .catch(err => res.sendStatus(500));
    res.sendStatus(201);
  }
}


export default new groupController();
