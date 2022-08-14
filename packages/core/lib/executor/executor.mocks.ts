import { IMessage } from '../messages';
import { Type } from '../utils/type.interface';
import { IExecutor } from './ports/executor.port';
import { IMessageExecutor } from './ports/message-executor.port';
import { ProvidersInstantiator } from './ports/providers-instantiator.port';

export class ExecutorMock implements IExecutor {
  execute = jest.fn();
}

export class MessageExecutorMock implements IMessageExecutor<IMessage, void> {
  execute = jest.fn();
}

export const providersInstantiatorMock: ProvidersInstantiator = (type: Type<any>) => new type();
