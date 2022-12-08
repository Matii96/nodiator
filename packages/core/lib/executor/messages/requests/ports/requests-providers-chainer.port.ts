import { Observable, Subject } from 'rxjs';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../../messages';
import { IMessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export interface IRequestsProvidersChainer {
  chain<TResult>(
    messageProcessingState: Subject<IMessageProcessingState>,
    request: IRequest,
    pipelines: IRequestPipeline<IRequest, TResult>[],
    handler: IRequestHandler<IRequest, TResult>
  ): Observable<TResult>;
}
