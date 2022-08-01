import express, { Request, Response } from 'express';
import { Mediator, MediatorLoggingLevels } from '@nodiator/core';

const mediator = new Mediator({ loggingLevel: MediatorLoggingLevels.DEBUG });

const app = express();
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
const port = 3000;
app.listen(port, () => console.log('Listening on port ' + port));
