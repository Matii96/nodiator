import { catchError, defer, firstValueFrom, Subject, throwError } from 'rxjs';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../messages';
import { MessageTypes } from '../../../messages/message-types.enum';
import { IMessageProcessingState } from '../../interfaces/message-processing-state.interface';
import { IRequestsProvidersChainer } from './ports/requests-providers-chainer.port';

export class RequestsProvidersChainerService implements IRequestsProvidersChainer {
  constructor(private readonly subject: Subject<IMessageProcessingState>) {}

  chain<TResult>(
    id: string,
    request: IRequest,
    pipelines: IRequestPipeline<IRequest, TResult>[],
    handler: IRequestHandler<IRequest, TResult>
  ) {
    let next = this.wrapNext(id, request, handler);
    for (let idx = pipelines.length - 1; idx >= 0; idx--) {
      const currentNext = next;
      next = this.wrapNext(id, request, pipelines[idx], currentNext);
    }
    return next;
  }

  private wrapNext<TResult>(
    id: string,
    request: IRequest,
    provider: IRequestHandler<IRequest, TResult> | IRequestPipeline<IRequest, TResult>,
    next?: () => Promise<TResult>
  ) {
    return () => {
      this.subject.next({ id, type: MessageTypes.REQUEST, data: request, provider });
      return firstValueFrom(
        defer(() => provider.handle(request, next)).pipe(
          catchError((error) => {
            this.subject.next({ id, type: MessageTypes.REQUEST, data: request, provider, error });
            return throwError(() => error);
          })
        )
      );
    };
  }
}
