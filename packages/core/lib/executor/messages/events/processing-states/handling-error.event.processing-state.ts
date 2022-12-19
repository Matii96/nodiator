import { MessageProvider } from '../../../../messages';
import { MessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class HandlingErrorEventProcessingState implements MessageProcessingState {
  constructor(readonly provider: MessageProvider, readonly error: Error) {}
}
