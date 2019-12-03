

import l from '../../common/logger';
import mongoose from 'mongoose';
import { Variable, VariableSchema, IVariable } from '../models/variables.model';
import { IUser } from '../models/users.model';


class VariableInMongoDatabase {

    async createVariable(data: IVariable, by: IUser) {
        const variablePerId = await db.findVariableById(data.variable_id)
           if (variablePerId) {
               const message = "This Variable id already exist in database";
                l.error(message);
                throw new Error(message);
           } 
        const id = this.uuidv4();

        let variable = new Variable({
            variable_id: id,
            workflow_id: data.workflow_id,
            name: data.name,
            defaultValue: data.defaultValue,
            type: data.type,
            direction: data.direction
        });
        l.debug('Create : ',variable);
        variable.save();
        return variable;
    }

   async findVariableById(variableId:string){
        return await Variable.findOne({variable_id: variableId});
    }

    async findAllVariables() {
        return await Variable.find();
    }

    async deleteVariable(id: string) {
        l.debug('Deleting Variable Id : ', id);
        return await Variable.findOneAndDelete({variable_id: id});
    }

    async updateVariable(id: string, newVariable: IVariable) {
        l.debug('Updating Variable Id : ', id);
        return await Variable.findOneAndUpdate({variable_id: id},newVariable);
    }

    async findVariableByWorkFlowId(id: string) {
        return await Variable.find({workflow_id: id});
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}


export const db = new VariableInMongoDatabase();


