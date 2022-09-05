import { IMessageProcessingState } from '../../../interfaces';

export interface IEventProcessingState extends IMessageProcessingState {
  /**
   * Indicates that given handler finished his job regardless whether an exception has been raised.
   */
  handled?: boolean;

  /**
   * Indicates that event was processed by all handlers.
   */
  processed?: boolean;
}
