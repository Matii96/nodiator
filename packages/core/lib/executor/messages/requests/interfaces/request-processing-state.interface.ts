import { IMessageProcessingState } from '../../../interfaces';

export interface IRequestProcessingState<TResult = any> extends IMessageProcessingState {
  /**
   * Data returned from given request provider.
   */
  response?: { value: TResult };

  /**
   * Indicates that request was processed by the provider.
   */
  processed?: boolean;
}
