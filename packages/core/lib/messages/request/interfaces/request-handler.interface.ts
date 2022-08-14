import { IMessageProvider } from '../../interfaces/message-provider.interface';
import { IRequest } from './request.interface';

export interface IRequestHandler<TRequest extends IRequest, TResult> extends IMessageProvider {
  handle(request: TRequest): Promise<TResult>;
}
