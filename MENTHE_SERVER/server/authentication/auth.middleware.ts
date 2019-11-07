
import {Request, Response, NextFunction } from 'express';
import l from '../common/logger';

export function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    l.debug('User Id: ', req['userId']);
    if (req['userId']) {
        next();
    } else {
        res.sendStatus(403);
    }
}