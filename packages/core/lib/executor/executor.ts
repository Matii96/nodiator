import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { IMessageExecutor } from './ports/message-executor.port';
import { IExecutor } from './ports/executor.port';

export class Executor implements IExecutor {
  constructor(private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>) {}

  execute<TResult>(message: IMessage, messageType: MessageTypes) {
    const id = uuidv4();
    return this.executors[messageType].execute(id, message) as Observable<TResult>;
  }
}
