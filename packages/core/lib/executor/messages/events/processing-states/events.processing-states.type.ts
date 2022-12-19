import { HandlingCompletedEventProcessingState } from './handling-completed.event.processing-state';
import { HandlingErrorEventProcessingState } from './handling-error.event.processing-state';
import { HandlingStartedEventProcessingState } from './handling-started.event.processing-state';

export type EventsEventProcessingStates =
  | HandlingStartedEventProcessingState
  | HandlingErrorEventProcessingState
  | HandlingCompletedEventProcessingState;
