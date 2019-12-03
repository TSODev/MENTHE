

import l from '../../common/logger';
import mongoose from 'mongoose';
import { Process, ProcessSchema, IProcess } from '../models/process.model';
import { IUser } from '../models/users.model';


class ProcessInMongoDatabase {

    async createProcess(data: IProcess, by: IUser) {
        const processPerId = await db.findProcessById(data.process_id)
           if (processPerId) {
               const message = "This Process id already exist in database";
                l.error(message);
                throw new Error(message);
           } 
        const id = this.uuidv4();

        let process = new Process({
            process_id: id,
            name: data.name,
        });
        l.debug('Create : ',process);
        process.save();
        return process;
    }

   async findProcessById(processId:string){
        return await Process.findOne({process_id: processId});
    }

    async findAllProcesss() {
        return await Process.find();
    }

    async deleteProcess(id: string) {
        l.debug('Deleting Process Id : ', id);
        return await Process.findOneAndDelete({process_id: id});
    }

    async updateProcess(id: string, newProcess: IProcess) {
        l.debug('Updating Process Id : ', id);
        return await Process.findOneAndUpdate({process_id: id},newProcess);
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}


export const db = new ProcessInMongoDatabase();


