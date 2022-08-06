import { Observable } from 'rxjs';
import { IEvent, IRequest } from '../../messages';
import { IMessageProcessingState } from '../../executor';
import { IProvidersManager } from '../../providers-manager/ports/providers-manager.port';

export interface IMediator extends Observable<IMessageProcessingState> {
  providers: IProvidersManager;
  request<TResult>(request: IRequest): Promise<TResult>;
  publish(...events: IEvent[]): Promise<void>;
}
