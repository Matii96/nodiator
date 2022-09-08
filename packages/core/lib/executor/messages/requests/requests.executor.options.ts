import { Observable } from 'rxjs';
import { IRequest } from '../../../messages';

export interface CallOptions<TResult> {
  id: string;
  request: IRequest;
  chain: Observable<TResult>;
}
