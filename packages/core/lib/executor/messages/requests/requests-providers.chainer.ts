import { catchError, defer, from, Observable, share, Subject, tap, throwError } from 'rxjs';
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
    next?: Observable<TResult>
  ) {
    return defer(() => {
      this.subject.next({ id, messageType: MessageTypes.REQUEST, message: request, provider });

      const call = next
        ? (provider as IRequestPipeline<IRequest, TResult>).handle(request, next)
        : (provider as IRequestHandler<IRequest, TResult>).handle(request);
      const handler = call instanceof Observable ? call : from(call);

      return handler.pipe(
        catchError((error) => {
          this.subject.next({ id, messageType: MessageTypes.REQUEST, message: request, provider, error });
          return throwError(() => error);
        }),
        tap((value) =>
          this.subject.next({
            id,
            messageType: MessageTypes.REQUEST,
            message: request,
            provider,
            response: { value },
          })
        )
      );
    }).pipe(share());
  }
}
