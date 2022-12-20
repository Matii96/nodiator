import { catchError, defer, from, Observable, share, Subject, tap, throwError } from 'rxjs';
import { Request, IRequestPipeline, IRequestHandler } from '../../../../messages';
import { RequestsProvidersChainer } from './requests-providers-chainer';
import {
  HandlingCompletedRequestProcessingState,
  HandlingErrorRequestProcessingState,
  HandlingStartedRequestProcessingState,
  RequestsProcessingStates,
} from '../processing-states';

export class MediatorRequestsProvidersChainer implements RequestsProvidersChainer {
  chain<TResult>(
    messageProcessing: Subject<RequestsProcessingStates>,
    request: Request,
    pipelines: IRequestPipeline<Request, TResult>[],
    handler: IRequestHandler<Request, TResult>
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
    request: Request,
    provider: IRequestHandler<Request, TResult> | IRequestPipeline<Request, TResult>,
    next?: Observable<TResult>
  ) {
    return defer(() => {
      messageProcessing.next(new HandlingStartedRequestProcessingState(provider));

      const call = next
        ? (provider as IRequestPipeline<Request, TResult>).handle(request, next)
        : (provider as IRequestHandler<Request, TResult>).handle(request);
      const handler = call instanceof Observable ? call : from(call);

      return handler.pipe(
        catchError((error) => {
          messageProcessing.next(new HandlingErrorRequestProcessingState(provider, error));
          return throwError(() => error);
        }),
        tap((value) => messageProcessing.next(new HandlingCompletedRequestProcessingState(provider, value)))
      );
    }).pipe(share());
  }
}
