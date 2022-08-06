import { Type } from '../../../utils/type.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';
import { EventsBeginningEndingLoggingBehaviour } from './beginning-ending.logging-behaviour';
import { EventsErrorLoggingBehaviour } from './error.logging-behaviour';
import { EventsHandlingStartedLoggingBehaviour } from './handling-started.logging-behaviour';

export const eventsLoggingBehaviours: Type<ILoggingBehaviour>[] = [
  EventsBeginningEndingLoggingBehaviour,
  EventsErrorLoggingBehaviour,
  EventsHandlingStartedLoggingBehaviour,
];
