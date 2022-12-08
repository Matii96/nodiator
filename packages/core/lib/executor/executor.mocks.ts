import { EMPTY, of } from 'rxjs';
import { IMessage } from '../messages';
import { ClassConstructor } from '../utils/class-constructor.interface';
import { IRequestsProvidersChainer } from './messages/requests/ports/requests-providers-chainer.port';
import { IExecutor } from './ports/executor.port';
import { IMessageExecutor } from './ports/message-executor.port';
import { ProvidersInstantiator } from './ports/providers-instantiator.port';

export class ExecutorMock implements IExecutor {
  execute = jest.fn(() => EMPTY);
}

export class MessageExecutorMock implements IMessageExecutor<IMessage, void> {
  execute = jest.fn(() => EMPTY);
}

export const providersInstantiatorMock: ProvidersInstantiator = (type: ClassConstructor) => new type();

export class RequestsProvidersChainerMock implements IRequestsProvidersChainer {
  chain = jest.fn(() => of());
}
