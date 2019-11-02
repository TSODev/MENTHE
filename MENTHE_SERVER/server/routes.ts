import { Application } from 'express';
//import examplesRouter from './api/controllers/examples/router';
import appRouter from './api/controllers/app/router';

export default function routes(app: Application): void {
//  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1', appRouter);
};