import { Subject } from 'rxjs';
import { IRequestProcessingState } from '../../../executor';
import { IMediatorLogger } from '../../../mediator/mediator.options';
import { IMessageProvider, MessageTypes } from '../../../messages';
import { TestRequest, TestRequestHandler } from '../../../messages/messages.mocks';
import { MediatorLoggerMock } from '../../logging.mocks';
import { RequestsBeginningEndingLoggingBehaviour } from './beginning-ending.logging-behaviour';

describe('RequestsBeginningEndingLoggingBehaviour', () => {
  let id: string;
  let logger: IMediatorLogger;
  let source: Subject<IRequestProcessingState>;
  let provider: IMessageProvider;

  beforeAll(() => {
    id = 'id';
    logger = new MediatorLoggerMock();
    source = new Subject();
    provider = new TestRequestHandler();
    new RequestsBeginningEndingLoggingBehaviour(logger, source.asObservable());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register occured request', () => {
    source.next({ id, messageType: MessageTypes.REQUEST, message: new TestRequest(), provider });
    expect(logger.debug).toHaveBeenCalledTimes(1);
  });

  it('should notice about request being processed', async () => {
    source.next({
      id,
      messageType: MessageTypes.REQUEST,
      message: new TestRequest(),
      processed: true,
    });

    await new Promise<void>((resolve) => setImmediate(resolve));
    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
