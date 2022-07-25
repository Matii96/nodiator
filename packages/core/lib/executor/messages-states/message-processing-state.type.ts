import { IMessageStartedState } from './message-started-state.interface';
import { IMessageErrorState } from './message-error-state.interface';

export type MessageProcessingState = IMessageStartedState | IMessageErrorState;
