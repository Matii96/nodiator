import { finalize, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { IMessageExecutor } from './ports/message-executor.port';
import { IMessageProcessing } from './message-processing';
import { IExecutor } from './ports/executor.port';

export class Executor implements IExecutor {
  constructor(
    private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>,
    private readonly _bus: Subject<IMessageProcessing>
  ) {}

  execute(messageType: MessageTypes, message: IMessage) {
    const messageProcessingState = new Subject<IMessageProcessing>();
    this._bus.next({
      id: uuidv4(),
      startedAt: new Date(),
      messageType,
      message,
      process: messageProcessingState.asObservable(),
    });
    return this.executors[messageType]
      .execute(messageProcessingState, message)
      .pipe(finalize(() => messageProcessingState.complete()));
  }
}
