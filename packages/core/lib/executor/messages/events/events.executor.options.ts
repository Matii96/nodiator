import { Subject } from 'rxjs';
import { Event, IEventHandler } from '../../../messages';
import { MediatorDynamicOptions } from '../../../options';
import { MessageProcessingState } from '../../message-processing';

export interface HandleEventOptions {
  config: MediatorDynamicOptions;
  messageProcessing: Subject<MessageProcessingState>;
  event: Event;
  handler: IEventHandler<Event>;
}
