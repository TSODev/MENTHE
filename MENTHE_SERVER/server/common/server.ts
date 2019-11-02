import express from 'express';
import { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import * as https from 'https';
import os from 'os';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import swaggerify from './swagger';
import l from './logger';
import * as fs from 'fs';
import { retrieveUserIdFromRequest } from './sessioncookie.middleware';
import { httpLogger } from './httplogger.middleware';

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');

    app.use(cookieParser(process.env.SESSION_SECRET));
//    app.use(cors);
    app.use(retrieveUserIdFromRequest);                 //need cookieParser to retrive userId from cookie
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(`${root}/public`));
    app.use(httpLogger);

  }



  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }

  listen(p: string | number = process.env.PORT): Application {
    const welcome = port => () => l.debug(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port: ${port}}`);
    if (process.env.RUN_MODE === 'secure') {
        const options = {
          key: fs.readFileSync('./server/common/tsodev.key'),
          cert: fs.readFileSync( './server/common/tsodev.crt' ),
          passphrase: 'MENTHE'
        };
        l.debug('Starting in secure mode...');
          https.createServer(options, app).listen(p, welcome(p));
    } else {
          http.createServer(app).listen(p, welcome(p));
    }

    return app;
  }
}
