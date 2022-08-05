import express, { Request, Response } from 'express';
import { MediatorFactory } from '@nodiator/core';

const mediator = MediatorFactory.create({ loggingLevel: 'DEBUG' });

const app = express();
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
const port = 3000;
app.listen(port, () => console.log('Listening on port ' + port));
