import { EMPTY, of } from 'rxjs';
import { Message } from '../messages';
import { ClassConstructor } from '../utils/class-constructor.interface';
import { RequestsProvidersChainer } from './messages/requests/ports/requests-providers-chainer.port';
import { Executor } from './ports/executor.port';
import { MessageExecutor } from './ports/message-executor.port';
import { ProvidersInstantiator } from './ports/providers-instantiator.port';

export class ExecutorMock implements Executor {
  execute = jest.fn(() => EMPTY);
}

export class MessageExecutorMock implements MessageExecutor<Message, void> {
  execute = jest.fn(() => EMPTY);
}

export const providersInstantiatorMock: ProvidersInstantiator = (type: ClassConstructor) => new type();

export class RequestsProvidersChainerMock implements RequestsProvidersChainer {
  chain = jest.fn(() => of());
}
