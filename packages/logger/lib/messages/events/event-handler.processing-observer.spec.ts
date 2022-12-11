import {
  IMessageProcessing,
  IMessageProcessingState,
  MessageTypes,
  HandlingStartedEventProcessingState,
  HandlingCompletedEventProcessingState,
} from '@nodiator/core';
import { Subject } from 'rxjs';
import { MediatorLoggerMock } from '../../mediator-logger/mediator-logger.mocks';
import { IMediatorLogger } from '../../mediator-logger/mediator-logger.port';
import { IProcessingObserver } from '../shared/processing-observer.interface';
import { EventProvidersProcessingObserver } from './event-handler.processing-observer';

describe('EventProvidersProcessingObserver', () => {
  let processSubject = new Subject<IMessageProcessingState>();
  let processing: IMessageProcessing;
  let mediatorLogger: IMediatorLogger;
  let observer: IProcessingObserver;

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
    observer = new EventProvidersProcessingObserver(mediatorLogger);
  });

  describe('log started', () => {
    it('should log message provider processing start', () => {
      observer.init(processing);
      processSubject.next(new HandlingStartedEventProcessingState({}));
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(1);
    });
  });

  describe('log completion', () => {
    it('should log message provider processing completion', () => {
      observer.init(processing);
      processSubject.next(new HandlingCompletedEventProcessingState({}));
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(1);
    });
  });
});
