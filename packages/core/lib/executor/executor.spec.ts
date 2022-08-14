import { IMessage, MessageTypes } from '../messages';
import { TestRequest } from '../messages/messages.mocks';
import { IExecutor } from './ports/executor.port';
import { IMessageExecutor } from './ports/message-executor.port';
import { MessageExecutorMock } from './executor.mocks';
import { Executor } from './executor';

describe('Executor', () => {
  let messageExecutor: IMessageExecutor<IMessage, any>;
  let executor: IExecutor;

  beforeEach(() => {
    messageExecutor = new MessageExecutorMock();
    executor = new Executor({
      [MessageTypes.REQUEST]: messageExecutor,
    } as unknown as Record<MessageTypes, IMessageExecutor<IMessage, any>>);
  });

  it('should run message executor', async () => {
    await executor.execute(new TestRequest(), MessageTypes.REQUEST);
    expect(messageExecutor.execute).toHaveBeenCalledTimes(1);
  });
});
