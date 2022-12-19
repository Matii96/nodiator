import { RequestsOptions } from './messages/requests.options';
import { EventsOptions } from './messages/events.options';

export interface MediatorDynamicOptions {
  requests?: RequestsOptions;
  events?: EventsOptions;
}
