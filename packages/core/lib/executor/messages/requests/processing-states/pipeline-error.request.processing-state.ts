import { IMessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class PipelineErrorRequestProcessingState implements IMessageProcessingState {
  constructor(readonly error: Error) {}
}
