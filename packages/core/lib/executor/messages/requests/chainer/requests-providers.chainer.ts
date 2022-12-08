import { catchError, defer, from, Observable, share, Subject, tap, throwError } from 'rxjs';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../../messages';
import { IRequestsProvidersChainer } from '../ports/requests-providers-chainer.port';
import {
  HandlingCompletedRequestProcessingState,
  HandlingErrorRequestProcessingState,
  HandlingStartedRequestProcessingState,
  RequestsProcessingStates,
} from '../processing-states';

export class RequestsProvidersChainer implements IRequestsProvidersChainer {
  chain<TResult>(
    messageProcessing: Subject<RequestsProcessingStates>,
    request: IRequest,
    pipelines: IRequestPipeline<IRequest, TResult>[],
    handler: IRequestHandler<IRequest, TResult>
  ) {
    let next = this.wrapNext(messageProcessing, request, handler);
    for (let idx = pipelines.length - 1; idx >= 0; idx--) {
      const currentNext = next;
      next = this.wrapNext(messageProcessing, request, pipelines[idx], currentNext);
    }
    return next;
  }

  private wrapNext<TResult>(
    messageProcessing: Subject<RequestsProcessingStates>,
    request: IRequest,
    provider: IRequestHandler<IRequest, TResult> | IRequestPipeline<IRequest, TResult>,
    next?: Observable<TResult>
  ) {
    return defer(() => {
      messageProcessing.next(new HandlingStartedRequestProcessingState(request));

      const call = next
        ? (provider as IRequestPipeline<IRequest, TResult>).handle(request, next)
        : (provider as IRequestHandler<IRequest, TResult>).handle(request);
      const handler = call instanceof Observable ? call : from(call);

      return handler.pipe(
        catchError((error) => {
          messageProcessing.next(new HandlingErrorRequestProcessingState(request, error));
          return throwError(() => error);
        }),
        tap((value) => messageProcessing.next(new HandlingCompletedRequestProcessingState(request, value)))
      );
    }).pipe(share());
  }
}
