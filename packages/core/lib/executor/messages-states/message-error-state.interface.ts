import { IMessageBaseState } from './message-base-state.interface';

export interface IMessageErrorState extends IMessageBaseState {
  error: Error;
}
