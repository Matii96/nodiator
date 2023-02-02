import { Observable } from 'rxjs';
import { MessageProvider } from '../../interfaces/message-provider.interface';
import { GetResponseType } from '../get-response-type';
import { Request } from '../request';

export interface IRequestPipeline<TRequest extends Request, TResponse = GetResponseType<TRequest>>
  extends MessageProvider {
  handle(request: TRequest, next: Observable<TResponse>): Observable<TResponse>;
}
