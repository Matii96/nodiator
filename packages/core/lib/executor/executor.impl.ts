import { finalize, Subject } from 'rxjs';
import { randomUUID } from 'crypto';
import { MessageTypes } from '../messages';
import { Message } from '../messages/interfaces/message.interface';
import { MessageExecutor } from './messages/shared/message-executor';
import { MessageProcessing } from './message-processing';
import { Executor } from './executor.port';

export class MediatorExecutor implements Executor {
  constructor(
    private readonly executors: Record<MessageTypes, MessageExecutor<Message, any>>,
    private readonly _bus: Subject<MessageProcessing>
  ) {}

  execute(messageType: MessageTypes, message: Message) {
    const messageProcessingState = new Subject<MessageProcessing>();
    this._bus.next({
      id: randomUUID(),
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
