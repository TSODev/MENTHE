import { Request, Response, NextFunction } from 'express';
import l from './logger';

export function httpLogger(req:Request, res:Response, next: NextFunction) {
    if (req.method !=='OPTIONS') {
    l.debug('HTTP Logger: ', req.method + " - " + req.url + ' by ' + JSON.stringify(req['userId']));
    }
    next();
}