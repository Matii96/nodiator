import { IMessageProvider } from '../../../../messages';
import { IMessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class HandlingCompletedRequestProcessingState<TResponse = any> implements IMessageProcessingState {
  constructor(readonly provider: IMessageProvider, readonly response?: TResponse) {}
}