import { Subject } from 'rxjs';
import { Message, MessageTypes } from '../messages';
import { TestRequest } from '../messages/request/messages.mocks';
import { Executor } from './executor.port';
import { MessageExecutor } from './messages/shared/message-executor';
import { MessageExecutorMock } from './executor.mocks';
import { MediatorExecutor } from './executor.impl';

describe('Executor', () => {
  let messageExecutor: MessageExecutor<Message, any>;
  let executor: Executor;

  beforeEach(() => {
    messageExecutor = new MessageExecutorMock();
    executor = new MediatorExecutor(
      {
        [MessageTypes.REQUEST]: messageExecutor,
      } as unknown as Record<MessageTypes, MessageExecutor<Message, any>>,
      new Subject()
    );
  });

  it('should run message executor', (done) => {
    executor.execute(MessageTypes.REQUEST, new TestRequest()).subscribe({
      complete() {
        expect(messageExecutor.execute).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });
});
