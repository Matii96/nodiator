import { Observable } from 'rxjs';
import { IMessageProvider } from '../../interfaces/message-provider.interface';
import { IRequest } from './request.interface';

export interface IGlobalRequestPipeline extends IMessageProvider {
  handle(request: IRequest, next: Observable<unknown>): Observable<unknown>;
}
