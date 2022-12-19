import { Event } from '../../../../messages';
import { MessageExecutor } from '../../../ports/message-executor.port';

export interface EventsExecutor extends MessageExecutor<Event, Event> {}
