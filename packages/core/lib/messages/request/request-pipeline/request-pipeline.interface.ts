import { Observable } from 'rxjs';
import { MessageProvider } from '../../interfaces/message-provider.interface';
import { Request } from '../request';

export interface IRequestPipeline<TRequest extends Request, TResult> extends MessageProvider {
  handle(request: TRequest, next: Observable<TResult>): Observable<TResult>;
}
