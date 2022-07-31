import express, { Request, Response } from 'express';
import { Mediator, MediatorLoggingLevels } from '@nodiator/core';

const mediator = new Mediator({ loggingLevel: MediatorLoggingLevels.DEBUG });

const app = express();
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
