import {
  HandlingCompletedRequestProcessingState,
  HandlingStartedRequestProcessingState,
  MessageProcessing,
  MessageProcessingState,
  MessageTypes,
} from '@nodiator/core';
import { Subject } from 'rxjs';
import { MediatorLoggerMock } from '../../mediator-logger/mediator-logger.mocks';
import { MediatorLogger } from '../../mediator-logger/mediator-logger';
import { ProcessingObserver } from '../shared/processing-observer.interface';
import { RequestProvidersProcessingObserver } from './request-providers.processing-observer';

describe('RequestProvidersProcessingObserver', () => {
  let processSubject = new Subject<MessageProcessingState>();
  let processing: MessageProcessing;
  let mediatorLogger: MediatorLogger;
  let observer: ProcessingObserver;

  beforeEach(() => {
    processSubject = new Subject();
    processing = {
      id: 'id',
      startedAt: new Date(),
      messageType: MessageTypes.REQUEST,
      message: {},
      process: processSubject.asObservable(),
    };
    mediatorLogger = new MediatorLoggerMock();
    observer = new RequestProvidersProcessingObserver(mediatorLogger);
  });

  describe('log started', () => {
    it('should log message provider processing start', () => {
      observer.init(processing);
      processSubject.next(new HandlingStartedRequestProcessingState({}));
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(1);
    });
  });

  describe('log completion', () => {
    it('should log message provider processing completion', () => {
      observer.init(processing);
      processSubject.next(new HandlingCompletedRequestProcessingState({}));
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(1);
    });
  });
});
