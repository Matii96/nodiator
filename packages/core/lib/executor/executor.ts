import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { IMessageExecutor } from './ports/message-executor.port';
import { IMessageProcessingState } from './interfaces/message-processing-state.interface';

export class Executor {
  constructor(private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>) {}

  execute<TResult>(message: IMessage, messageType: MessageTypes) {
    return this.executors[messageType].execute(message) as Promise<TResult>;
  }
}
