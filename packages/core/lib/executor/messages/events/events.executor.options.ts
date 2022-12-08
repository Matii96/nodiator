import { Subject } from 'rxjs';
import { IEvent, IEventHandler } from '../../../messages';
import { MediatorDynamicOptions } from '../../../options';
import { IMessageProcessingState } from '../../message-processing';

export interface HandleEventOptions {
  config: MediatorDynamicOptions;
  messageProcessing: Subject<IMessageProcessingState>;
  event: IEvent;
  handler: IEventHandler<IEvent>;
}
