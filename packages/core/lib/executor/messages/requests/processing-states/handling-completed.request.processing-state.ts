import { MessageProvider } from '../../../../messages';
import { MessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class HandlingCompletedRequestProcessingState<TResponse = any> implements MessageProcessingState {
  constructor(readonly provider: MessageProvider, readonly response?: TResponse) {}
}
