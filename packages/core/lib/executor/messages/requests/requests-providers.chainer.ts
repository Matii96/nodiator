import { catchError, defer, firstValueFrom, Subject, throwError } from 'rxjs';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../messages';
import { MessageTypes } from '../../../messages/message-types.enum';
import { IRequestProcessingState } from './interfaces/request-processing-state.interface';
import { IRequestsProvidersChainer } from './ports/requests-providers-chainer.port';

export class RequestsProvidersChainer implements IRequestsProvidersChainer {
  constructor(private readonly subject: Subject<IRequestProcessingState>) {}

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
    return async () => {
      this.subject.next({ id, messageType: MessageTypes.REQUEST, message: request, provider });
      const args = [request, next].filter((arg) => arg) as [IRequest, () => Promise<TResult>];
      const result = await firstValueFrom(
        defer(() => provider.handle(...args)).pipe(
          catchError((error) => {
            this.subject.next({ id, messageType: MessageTypes.REQUEST, message: request, provider, error });
            return throwError(() => error);
          })
        )
      );
      this.subject.next({
        id,
        messageType: MessageTypes.REQUEST,
        message: request,
        provider,
        result: { value: result },
      });
      return result;
    };
  }
}
