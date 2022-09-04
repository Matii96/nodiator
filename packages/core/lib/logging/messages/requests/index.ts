import { Type } from '../../../utils/type.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';
import { RequestsBeginningEndingLoggingBehaviour } from './beginning-ending.logging-behaviour';
import { RequestsErrorLoggingBehaviour } from './error.logging-behaviour';
import { RequestsProviderRespondedLoggingBehaviour } from './provider-responded.logging-behaviour';
import { RequestsHandlingStartedLoggingBehaviour } from './handling-started.logging-behaviour';

export const requestsLoggingBehaviours: Type<ILoggingBehaviour>[] = [
  RequestsBeginningEndingLoggingBehaviour,
  RequestsHandlingStartedLoggingBehaviour,
  RequestsProviderRespondedLoggingBehaviour,
  RequestsErrorLoggingBehaviour,
];
