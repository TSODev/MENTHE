
import { decodeJwt} from '../authentication/security.utils';
import { Request, Response, NextFunction } from 'express';
import l from './logger';

export function retrieveUserIdFromRequest(req: Request, res: Response, next: NextFunction) {

    const jwt = req.cookies["SESSIONID"];

    if (jwt) {
//        l.debug("SESSIONID:", jwt);
        handleSessionCookie(jwt, req)
            .then(() => next())
            .catch(err => {
                l.error('retrieve user middleware', err);
                next();
            })
    } else {
        l.debug('No token in cookies...')
        next();
    }
}

async function handleSessionCookie(jwt:string, req: Request) {
    try {
        const payload = await decodeJwt(jwt);
        req["userId"] = payload;
    }
    catch(err) {
        l.error("Error: Could not extract user from request :", err.message);
    }
}