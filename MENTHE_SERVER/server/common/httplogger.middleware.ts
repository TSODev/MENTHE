import { Request, Response, NextFunction } from 'express';
import l from './logger';

export function httpLogger(req:Request, res:Response, next: NextFunction) {
    l.debug('HTTP Logger Request : ', req.method + " - " + req.url + ' by ' + JSON.stringify(req['userId']));
    next();
}