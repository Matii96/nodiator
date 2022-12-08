import { IMessageProvider } from '../../../../messages';
import { IMessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export class HandlingErrorRequestProcessingState implements IMessageProcessingState {
  constructor(readonly provider: IMessageProvider, readonly error: Error) {}
}
