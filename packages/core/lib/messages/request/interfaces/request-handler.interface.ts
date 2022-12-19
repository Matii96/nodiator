import { Observable } from 'rxjs';
import { MessageProvider } from '../../interfaces/message-provider.interface';
import { Request } from './request.interface';

export interface IRequestHandler<TRequest extends Request, TResult> extends MessageProvider {
  handle(request: TRequest): Promise<TResult> | Observable<TResult>;
}
