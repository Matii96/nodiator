import {
  MessageProcessing,
  MessageProcessingState,
  MessageTypes,
  PipelineErrorRequestProcessingState,
} from '@nodiator/core';
import { Subject } from 'rxjs';
import { ExceptionsLoggerMock } from '../../exceptions-logger/exceptions.logger.mocks';
import { ExceptionsLogger } from '../../exceptions-logger/exceptions.logger';
import { MediatorLoggerMock } from '../../mediator-logger/mediator-logger.mocks';
import { MediatorLogger } from '../../mediator-logger/mediator-logger';
import { ProcessingObserver } from '../shared/processing-observer.interface';
import { RequestProcessingObserver } from './request.processing-observer';

describe('RequestProcessingObserver', () => {
  let processSubject = new Subject<MessageProcessingState>();
  let processing: MessageProcessing;
  let mediatorLogger: MediatorLogger;
  let exceptionsLogger: ExceptionsLogger;
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
    exceptionsLogger = new ExceptionsLoggerMock();
    observer = new RequestProcessingObserver(mediatorLogger, exceptionsLogger);
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
      processSubject.next(new PipelineErrorRequestProcessingState(new Error()));
      expect(exceptionsLogger.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('log completion', () => {
    it('should log message processing completion', () => {
      observer.init(processing);
      processSubject.complete();
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(2); // started + completed
      expect(mediatorLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should not log message processing completion - error encountered', () => {
      observer.init(processing);
      processSubject.next(new PipelineErrorRequestProcessingState(new Error()));
      processSubject.complete();
      expect(mediatorLogger.debug).toHaveBeenCalledTimes(1); // started
      expect(mediatorLogger.info).not.toHaveBeenCalled();
    });
  });
});
