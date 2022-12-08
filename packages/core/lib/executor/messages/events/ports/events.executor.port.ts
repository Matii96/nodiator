import { IEvent } from '../../../../messages';
import { IMessageExecutor } from '../../../ports/message-executor.port';

export interface IEventsExecutor extends IMessageExecutor<IEvent, IEvent> {}
