//import UserService from '../../services/users.service';
import { Request, Response } from 'express';

//import { dbUser } from '../../../dbUser/database.mongo';
import { dbUser } from '../../services/user.service';
import argon2 from 'argon2';
import { createSessionToken, createCsrfToken } from "../../../authentication/security.utils";
import l from '../../../common/logger';
//import { DbUser } from '../../../dbUser/dbUser-user';
import { User} from '../../models/users.model';
import { IUser } from '../../models/users.model';

export class userController {

  async whoAmI(req: Request, res: Response) {
    return await dbUser.findUserById(req['userId'].sub);
  }

  async allUsers(req: Request, res: Response) {
    if (!dbUser.dbConnected) res.sendStatus(500);
    const users = await dbUser.findAllUsers();
    res.status(200).json({users: users});
  }

  async getAllUsersInTenant(req: Request, res: Response) {
    if (!dbUser.dbConnected) res.sendStatus(500);
    const users = await dbUser.findAllUsersForTenant(req['userId'].sub);
    res.status(200).json({users: users});
  }

  createUser(req: Request, res: Response): void {
    if (!dbUser.dbConnected) res.sendStatus(500);
   const credentials = req.body;
    l.debug('Register User : ', credentials);
//    const errors = validatePassword(credentials.password);
    const errors = '';
    if (errors.length > 0) {
        res.status(400).json(errors);
    } else {
        createUserAndSession(res, credentials)
        .catch(() => {res.sendStatus(500)});   
    }
  }

  async login(req: Request, res: Response) {

    if (!dbUser.dbConnected) res.sendStatus(500);

    const credentials = req.body;
    const user = await dbUser.findUserByEmail(credentials.email);

    if (!user) {
      res.sendStatus(401);
    }
    else {
      loginAndBuildResponse(credentials, user, res);
    }
  }

  async logout(req: Request, res: Response) {
    l.debug("Route: Logout");
    res.clearCookie("SESSIONID");
    res.clearCookie("XSRF-TOKEN");
    res.status(200).json({message: 'Logout Successful'});
  }

  getContent(req: Request, res: Response){
    l.debug("Route : GetContent");
    res.status(200).json({contenu: 'ceci est un test'});
  }

  async getUser(req: Request, res: Response) {
    if (!dbUser.dbConnected) res.sendStatus(500);
    l.debug("looking for current User (id): ", req["userId"]);
    const user = await dbUser.findUserById(req["userId"].sub);

    if (user) {
      res.status(200).json({user: user});
    } else {
      res.sendStatus(204);
    }
  }

  async getUserById(req: Request, res: Response){
    if (!dbUser.dbConnected) res.sendStatus(500);
    const id = req.params['id'];
    l.debug("looking for userId: ", id);
    const user = await dbUser.findUserById(id);
    if (user) {
      res.status(200).json({user: user});
    } else {
      res.sendStatus(204);
    }
  }

  async getUserByEmail(req: Request, res: Response){
    if (!dbUser.dbConnected) res.sendStatus(500);
    const email = req.params['email'];
    l.debug("looking for user email: ", email);
    const user = await dbUser.findUserByEmail(email);
    if (user) {
      res.status(200).json({user: user});
    } else {
      res.sendStatus(500);
    }
  }

  async deleteUser(req: Request, res:Response){
    if (!dbUser.dbConnected) res.sendStatus(500);
    l.debug('Request for delete userId:', req.params.id);
    const user = await dbUser.deleteUser(req.params.id)
      .catch(err => res.sendStatus(500));
    res.sendStatus(201);
  }
}

//---------------------------------------------------------------------------------------

async function createUserAndSession(res:Response, credentials) {

  const passwordDigest = await argon2.hash(credentials.password);

  try {
      const user = await dbUser.createUser(credentials, passwordDigest);
      const sessionToken = await createSessionToken(user);
      const csrfToken = await createCsrfToken(sessionToken);

      res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});
      res.cookie("XSRF-TOKEN", csrfToken);
      res.status(200).json({user: user});
  } catch (error) {
    res.status(500).json({error: 'Email already registered'});
  }



}

//---------------------------------------------------------------------------------------

async function loginAndBuildResponse(credentials:any, user:IUser, res: Response){
  try {
    const sessionToken = await attemptLogin(credentials, user);
    const csrfToken = await createCsrfToken(sessionToken);
    l.debug("Login successful");
    res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});
    res.cookie('XSRF-TOKEN', csrfToken);
    res.status(200).json({user_id:user.user_id, email:user.email, firstname: user.firstname, lastname: user.lastname, roles: user.roles});
  } catch (error) {
    l.error("Login failed!");
    res.sendStatus(401);
  }
}

//---------------------------------------------------------------------------------------

async function attemptLogin(credentials:any, user: IUser){
  const isPasswordValid = await argon2.verify(user.passwordDigest, credentials.password);
  if (!isPasswordValid) {
    throw new Error("Password Invalid");
  }
  return createSessionToken(user);
}

export default new userController();
