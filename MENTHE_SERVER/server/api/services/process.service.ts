

import l from '../../common/logger';
import mongoose from 'mongoose';
import { Process, ProcessSchema, IProcess, ProcessState } from '../models/process.model';
import { IUser } from '../models/users.model';


class ProcessInMongoDatabase {

    async createProcess(data: IProcess, by: IUser) {
        const processPerId = await db.findProcessById(data.processId)
           if (processPerId) {
               const message = "This Process id already exist in database";
                l.error(message);
                throw new Error(message);
           } 
//        const id = this.uuidv4();

        let process = new Process({
            workflowId: data.workflowId,
            processId: data.processId,
            state: ProcessState.LOADING,
            name: data.name,
        });
        l.debug('Create : ',process);
        process.save();
        return process;
    }

   async findProcessById(processId:string){
        return await Process.findOne({processId: processId});
    }

    async findAllProcesss() {
        return await Process.find();
    }

    async deleteProcess(id: string) {
        l.debug('Deleting Process Id : ', id);
        return await Process.findOneAndDelete({processId: id});
    }

    async updateProcess(id: string, newProcess: IProcess) {
        l.debug('Updating Process Id : ', id);
        return await Process.findOneAndUpdate({processId: id},newProcess);
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}


export const db = new ProcessInMongoDatabase();


