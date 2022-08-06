import { IMessageProcessingState } from '../../../interfaces';

export interface IRequestProcessingState<TResult = any> extends IMessageProcessingState {
  /**
   * Data returned from given request provider
   */
  result?: { value: TResult };
}
