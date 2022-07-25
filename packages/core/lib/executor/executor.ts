import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { IMessageExecutor } from './interfaces/message-executor.interface';
import { MessageProcessingState } from './messages-states/message-processing-state.type';

export class Executor {
  constructor(private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>) {}

  execute<TResult>(message: IMessage, messageType: MessageTypes) {
    return this.executors[messageType].execute(message) as Promise<TResult>;
  }
}
