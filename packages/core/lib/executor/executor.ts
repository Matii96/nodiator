import { finalize, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MessageTypes } from '../messages';
import { Message } from '../messages/interfaces/message.interface';
import { MessageExecutor } from './ports/message-executor.port';
import { MessageProcessing } from './message-processing';
import { Executor } from './ports/executor.port';

export class MediatorExecutor implements Executor {
  constructor(
    private readonly executors: Record<MessageTypes, MessageExecutor<Message, any>>,
    private readonly _bus: Subject<MessageProcessing>
  ) {}

  execute(messageType: MessageTypes, message: Message) {
    const messageProcessingState = new Subject<MessageProcessing>();
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
