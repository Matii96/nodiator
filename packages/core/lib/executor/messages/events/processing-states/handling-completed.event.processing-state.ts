import { MessageProvider } from '../../../../messages';
import { MessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class HandlingCompletedEventProcessingState implements MessageProcessingState {
  constructor(readonly provider: MessageProvider) {}
}
