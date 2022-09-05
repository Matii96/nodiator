import { Observable } from 'rxjs';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../../messages';

export interface IRequestsProvidersChainer {
  chain<TResult>(
    id: string,
    request: IRequest,
    pipelines: IRequestPipeline<IRequest, TResult>[],
    handler: IRequestHandler<IRequest, TResult>
  ): Observable<TResult>;
}
