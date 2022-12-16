import { MessageProvider } from '../../../../messages';
import { MessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class HandlingErrorRequestProcessingState implements MessageProcessingState {
  constructor(readonly provider: MessageProvider, readonly error: Error) {}
}
