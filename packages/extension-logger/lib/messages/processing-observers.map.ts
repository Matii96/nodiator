import { MessageTypes } from '@nodiator/core';
import { ClassConstructor } from '../utils/class-constructor.interface';
import { RequestProcessingObserver } from './requests/request.processing-observer';
import { RequestProvidersProcessingObserver } from './requests/request-providers.processing-observer';
import { EventProcessingObserver } from './events/event.processing-observer';
import { EventProvidersProcessingObserver } from './events/event-handler.processing-observer';
import { ProcessingObserver } from './shared/processing-observer.interface';

export const PROCESSING_OBSERVERS: Record<MessageTypes, ReadonlyArray<ClassConstructor<ProcessingObserver>>> = {
  [MessageTypes.REQUEST]: [RequestProcessingObserver, RequestProvidersProcessingObserver],
  [MessageTypes.EVENT]: [EventProcessingObserver, EventProvidersProcessingObserver],
} as const;
