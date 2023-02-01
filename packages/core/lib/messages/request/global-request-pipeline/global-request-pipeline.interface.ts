import { Observable } from 'rxjs';
import { MessageProvider } from '../../interfaces/message-provider.interface';
import { Request } from '../request';

export interface IGlobalRequestPipeline extends MessageProvider {
  handle(request: Request, next: Observable<unknown>): Observable<unknown>;
}
