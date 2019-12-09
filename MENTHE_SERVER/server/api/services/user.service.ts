

import l from '../../common/logger';
import mongoose from 'mongoose';
import { User, UserSchema, IUser } from '../models/users.model';
import { Group, GroupSchema } from '../models/groups.model';
import * as _ from 'lodash';


class InMongoDatabase {

    public dbConnected = false;

    isAdmin(user: IUser) {
        return ((_.intersection(user.roles, ['ADMIN'])).length > 0);
      }
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

            mongoose.connect(connectionString, mongo_Connection_Options).then(
                () => { /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */ 
                    l.debug('Connected !');
                    this.dbConnected = true;
                },
                err => { /** handle initial connection error */ 
                    l.debug('Connection Error : ', err);
                }
              );

              mongoose.connection.on('error', err => {
                l.error('MongoDB: ',err);
                l.error ('If you are using MongoDB Atlas (cloud), please verify your IP address is whitelisted in the Network Access Security tab ...');
                this.dbConnected = false;
              });

              mongoose.connection.once('connected', () => {
                  l.debug('MongoDB database connection established successfully');
                  this.dbConnected = true;
              })

//            mongoose.Promise = global.Promise;
    }

    isDbConnected() {
        return this.dbConnected;
    }

    async createUser(credentials, passwordDigest: string){
        const usersPerEmail = await dbUser.findUserByEmail(credentials.email)
        if (usersPerEmail) {
            const message = "An user already exists with email " + credentials.email;
            l.error(message);
            throw new Error(message);
        }

        const id = this.uuidv4();

        let user = new User({
            user_id: id,
            email: credentials.email,
            passwordDigest: passwordDigest,
            lastname: credentials.lastName,
            firstname: credentials.firstName,
            company: credentials.company,
            roles: credentials.roles,
            groups: credentials.groups,
        });
        user.domain = UserSchema.methods.GetDomainName(user.email);
        user.roles.push('VIEWER');                                      //default role is VIEWVER
        user.save();
        return user;        
    }


    async findUserByEmail(email: string): Promise<IUser> {
        return await User.findOne({email: email});
    }

    async findUserById(userId:string): Promise<IUser>{
        return await User.findOne({user_id: userId});
    }

    async findAllUsers(): Promise<IUser[]> {
        return await User.find();
    }


    async findAllUsersForTenant(userId: string) {
        const user = await dbUser.findUserById(userId);
        if (this.isAdmin(user)){
            return await User.find();
        } else {
            return await User.find({company: user.company});
        }
    }
    async deleteUser(id: string): Promise<IUser> {
        l.debug('Deleting userId : ', id);
        return await User.findOneAndDelete({user_id: id});
    }

    async addUserInGroup(userId: string, groupId: string){
        l.debug('Adding userId : ', userId, ' in groupId : ', groupId );
        await User.findOne({user_id: userId}, (update) => {
            update.groups.push(groupId);
            return User.findOneAndUpdate({user_id: userId}, update);
        })

    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}


export const dbUser = new InMongoDatabase();


