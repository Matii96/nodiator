import { Subject } from 'rxjs';
import { IEventProcessingState } from '../../../executor';
import { IMediatorLogger } from '../../../mediator/mediator.options';
import { MessageTypes } from '../../../messages';
import { TestEvent } from '../../../messages/messages.mocks';
import { MediatorLoggerMock } from '../../logging.mocks';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';
import { EventsBeginningEndingLoggingBehaviour } from './beginning-ending.logging-behaviour';

describe('EventsBeginningEndingLoggingBehaviour', () => {
  let id: string;
  let logger: IMediatorLogger;
  let source: Subject<IEventProcessingState>;
  let behaviour: ILoggingBehaviour;

  beforeAll(() => {
    id = 'id';
    logger = new MediatorLoggerMock();
    source = new Subject();
    behaviour = new EventsBeginningEndingLoggingBehaviour(logger, source.asObservable());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register occured event', () => {
    source.next({ id, messageType: MessageTypes.EVENT, message: new TestEvent() });
    expect(logger.debug).toHaveBeenCalledTimes(1);
  });

  it('should notice about event being processed', () => {
    source.next({ id, messageType: MessageTypes.EVENT, message: new TestEvent(), processed: true });
    expect(logger.info).toHaveBeenCalledTimes(1);
  });

  it('should skip noticing about event being processed - handler error occured', () => {
    source.next({ id, messageType: MessageTypes.EVENT, message: new TestEvent(), error: new Error(), processed: true });
    expect(logger.info).not.toHaveBeenCalled();
  });
});
