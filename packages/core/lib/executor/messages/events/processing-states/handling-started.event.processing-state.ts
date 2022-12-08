import { IMessageProvider } from '../../../../messages';
import { IMessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class HandlingStartedEventProcessingState implements IMessageProcessingState {
  constructor(readonly provider: IMessageProvider) {}
}
