

import l from '../../common/logger';
import mongoose from 'mongoose';
import { User, UserSchema } from '../models/users.model';


class InMongoDatabase {

    userCounter = 0;
// 
    constructor() {
        const connectionString = process.env.DB_CONNECTION_STRING +
                                    process.env.DB_ROOT +
                                    ':' +
                                    process.env.DB_PASSWORD +
                                    '@' +
                                    process.env.DB_SERVER +
                                    ':' +
                                    process.env.DB_PORT +
                                    '/' +
                                    process.env.DB_NAME +
                                    process.env.DB_OPTIONS;
            l.debug("Connect to database : ", connectionString);
            
            const mongo_Connection_Options = {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }
            mongoose.connect(connectionString, mongo_Connection_Options);
            mongoose.Promise = global.Promise;
    }

    async createUser(credentials, passwordDigest: string){
        const usersPerEmail = await db.findUserByEmail(credentials.email)
        if (usersPerEmail) {
            const message = "An user already exists with email " + credentials.email;
            l.error(message);
            throw new Error(message);
        }
        this.userCounter++;
//        const id = this.userCounter;
        const id = this.uuidv4();

        let user = new User({
            user_id: id,
            email: credentials.email,
            passwordDigest: passwordDigest,
            lastname: credentials.lastName,
            firstname: credentials.firstName,
        });
        user.domain = UserSchema.methods.GetDomainName(user.email);
        user.roles.push('VIEWER');
        user.save();
        return user;        
    }


    async findUserByEmail(email: string) {
        return await User.findOne({email: email});
    }

    async findUserById(userId:string){
        return await User.findOne({user_id: userId});
    }

    async findAllUsers() {
        return await User.find();
    }

    async deleteUser(id: string) {
        l.debug('Deleting userId : ', id);
        return await User.findOneAndDelete({user_id: id});
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}


export const db = new InMongoDatabase();


