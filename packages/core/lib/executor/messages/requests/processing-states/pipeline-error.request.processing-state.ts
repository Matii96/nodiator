import { MessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class PipelineErrorRequestProcessingState implements MessageProcessingState {
  constructor(readonly error: Error) {}
}
