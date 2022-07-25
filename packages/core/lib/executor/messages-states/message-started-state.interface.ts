import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { IMessageBaseState } from './message-base-state.interface';

export interface IMessageStartedState extends IMessageBaseState {
  provider: IMessageProvider;
}
