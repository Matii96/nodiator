import express from 'express';
import { MediatorFactory } from '@nodiator/core';
import { LoggerExtension, MediatorLoggingLevels } from '@nodiator/logger';
import { itemsBootstrapper } from './items/items.bootstrapper';
import { historyBootstrapper } from './history/history.bootstrapper';

const app = express();
const mediator = MediatorFactory.create({ dynamicOptions: () => ({ requests: { timeout: 10 } }) });
mediator.use(new LoggerExtension({ dynamicOptions: () => ({ level: MediatorLoggingLevels.DEBUG }) }));

itemsBootstrapper(app, mediator);
historyBootstrapper(app, mediator);

const port = 3000;
app.listen(port, () => console.log('Listening on port ' + port));
