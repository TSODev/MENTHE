


import moment = require("moment");
const util = require('util');
const crypto = require('crypto');
import * as jwt from 'jsonwebtoken';
import * as fs from "fs";
import l from "../common/logger";
import argon2 from 'argon2';
import { IUser } from "../api/models/users.model";



export const randomBytes = util.promisify(crypto.randomBytes);

export const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync('./server/authentication/private.key');

const RSA_PUBLIC_KEY = fs.readFileSync('./server/authentication/public.key');

const SESSION_DURATION = 240;

export  async function createSessionToken(user: IUser){

    return signJwt({
        roles: user.roles
    }, 
        RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: SESSION_DURATION,
        subject: user.user_id.toString()
    });
}

export async function decodeJwt(token:string){

    const payload = await jwt.verify(token, RSA_PUBLIC_KEY );
//    l.debug("decoded JWT payload", payload);
    return payload;
}

export async function createCsrfToken(sessionToken:string) {
    return argon2.hash(sessionToken);
}