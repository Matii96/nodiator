import express from 'express';
import { MediatorFactory, MediatorLoggingLevels } from '@nodiator/core';
import { itemsBootstrapper } from './items/items.bootstrapper';
import { historyBootstrapper } from './history/history.bootstrapper';

const app = express();
const mediator = MediatorFactory.create({
  config() {
    return { requests: { timeout: 10 }, logs: { level: MediatorLoggingLevels.DEBUG } };
  },
});

itemsBootstrapper(app, mediator);
historyBootstrapper(app, mediator);

const port = 3000;
app.listen(port, () => console.log('Listening on port ' + port));
