import { Observable, Subject } from 'rxjs';
import { Request } from '../../../messages';
import { MessageProcessingState } from '../../message-processing/message-processing-state.interface';

export interface CallOptions<TResult> {
  readonly messageProcessing: Subject<MessageProcessingState>;
  readonly request: Request;
  readonly chain: Observable<TResult>;
}
