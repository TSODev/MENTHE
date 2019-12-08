

import l from '../../common/logger';
import mongoose from 'mongoose';
import { Group, GroupSchema, IGroup } from '../models/groups.model';


class InMongoDatabase {

    public dbConnected = false;
// 
    constructor() {}
    
async createGroup(group: IGroup){
        const groupsPerId = await dbGroup.findGroupById(group.group_id)
        if (groupsPerId) {
            const message = "An group already exists with Id " + group.group_id;
            l.error(message);
            throw new Error(message);
        }

        const id = this.uuidv4();

        let newgroup = new Group({
            group_id: id,
            groupemail: group.groupemail,
            groupname: group.groupname,
            description: group.description,
            roles: group.roles,
            createDate: Date.now(),
        });
//        newgroup.domain = GroupSchema.methods.GetDomainName(group.groupemail);
        newgroup.save();
        return group;        
    }


    async findGroupByEmail(email: string) {
        return await Group.findOne({groupemail: email});
    }

    async findGroupByName(name: string) {
        return await Group.findOne({groupname: name});
    }

    async findGroupById(groupId:string){
        return await Group.findOne({group_id: groupId});
    }

    async findAllGroups() {
        return await Group.find();
    }

    async deleteGroup(id: string) {
        l.debug('Deleting groupId : ', id);
        return await Group.findOneAndDelete({group_id: id});
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}


export const dbGroup = new InMongoDatabase();


