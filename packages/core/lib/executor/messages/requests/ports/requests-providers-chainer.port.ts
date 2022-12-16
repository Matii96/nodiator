import { Observable, Subject } from 'rxjs';
import { Request, IRequestHandler, IRequestPipeline } from '../../../../messages';
import { MessageProcessingState } from '../../../message-processing/message-processing-state.interface';

export interface RequestsProvidersChainer {
  chain<TResult>(
    messageProcessingState: Subject<MessageProcessingState>,
    request: Request,
    pipelines: IRequestPipeline<Request, TResult>[],
    handler: IRequestHandler<Request, TResult>
  ): Observable<TResult>;
}
