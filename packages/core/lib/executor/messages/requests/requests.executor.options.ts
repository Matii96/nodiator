import { Observable, Subject } from 'rxjs';
import { IRequest } from '../../../messages';
import { IMessageProcessingState } from '../../message-processing/message-processing-state.interface';

export interface CallOptions<TResult> {
  readonly messageProcessing: Subject<IMessageProcessingState>;
  readonly request: IRequest;
  readonly chain: Observable<TResult>;
}
