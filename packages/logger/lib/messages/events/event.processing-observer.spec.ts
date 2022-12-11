import {
  HandlingErrorEventProcessingState,
  IMessageProcessing,
  IMessageProcessingState,
  MessageTypes,
} from '@nodiator/core';
import { Subject } from 'rxjs';
import { ExceptionsLoggerMock } from '../../exceptions-logger/exceptions.logger.mocks';
import { IExceptionsLogger } from '../../exceptions-logger/exceptions.logger.port';
import { MediatorLoggerMock } from '../../mediator-logger/mediator-logger.mocks';
import { IMediatorLogger } from '../../mediator-logger/mediator-logger.port';
import { IProcessingObserver } from '../shared/processing-observer.interface';
import { EventProcessingObserver } from './event.processing-observer';

describe('EventProcessingObserver', () => {
  let processSubject = new Subject<IMessageProcessingState>();
  let processing: IMessageProcessing;
  let mediatorLogger: IMediatorLogger;
  let exceptionsLogger: IExceptionsLogger;
  let observer: IProcessingObserver;

  beforeEach(() => {
    processSubject = new Subject();
    processing = {
      id: 'id',
      startedAt: new Date(),
      messageType: MessageTypes.EVENT,
      message: {},
      process: processSubject.asObservable(),
    };
    mediatorLogger = new MediatorLoggerMock();
    exceptionsLogger = new ExceptionsLoggerMock();
    observer = new EventProcessingObserver(mediatorLogger, exceptionsLogger);
  });

  describe('log started', () => {
    it('should log message processing start', () => {
      observer.init(processing);
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(1);
    });
  });

  describe('log error', () => {
    it('should log message processing error', () => {
      observer.init(processing);
      processSubject.next(new HandlingErrorEventProcessingState({}, new Error()));
      expect(exceptionsLogger.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('log completion', () => {
    it('should log message processing completion', () => {
      observer.init(processing);
      processSubject.complete();
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(1); // started
      expect(mediatorLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should not log message processing completion - error encountered', () => {
      observer.init(processing);
      processSubject.next(new HandlingErrorEventProcessingState({}, new Error()));
      processSubject.complete();
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(1); // started
      expect(mediatorLogger.info).not.toHaveBeenCalled();
    });
  });
});
