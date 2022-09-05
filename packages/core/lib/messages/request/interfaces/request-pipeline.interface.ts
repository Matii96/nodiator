import { Observable } from 'rxjs';
import { IMessageProvider } from '../../interfaces/message-provider.interface';
import { IRequest } from './request.interface';

export interface IRequestPipeline<TRequest extends IRequest, TResult> extends IMessageProvider {
  handle(request: TRequest, next: Observable<TResult>): Observable<TResult>;
}
