import { EMPTY, of } from 'rxjs';
import { Message } from '../messages';
import { ClassConstructor } from '../utils/class-constructor.interface';
import { RequestsProvidersChainer } from './messages/requests/chainer/requests-providers-chainer';
import { Executor } from './executor.port';
import { MessageExecutor } from './messages/shared/message-executor';
import { ProvidersInstantiator } from './types/providers-instantiator.port';

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
