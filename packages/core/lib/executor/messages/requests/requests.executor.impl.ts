import { catchError, from, mergeMap, Subject, tap, throwError, timeout } from 'rxjs';
import { IRequestPipeline, Request } from '../../../messages';
import { RequestsProvidersSchema } from '../../../providers-manager/messages/requests/interfaces/requests-providers-schema.interface';
import { MessageTypes } from '../../../messages/message-types.enum';
import { ProvidersManager } from '../../../providers-manager/providers-manager';
import { MediatorOptions } from '../../../options/mediator.options';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../types/providers-instantiator.port';
import { MessageProcessingState } from '../../message-processing/message-processing-state.interface';
import { getTypeOfMessage } from '../../utils/get-type-of-message';
import { RequestsProvidersChainer } from './chainer/requests-providers-chainer';
import { NoHandlerException } from './exceptions/no-handler.exception';
import { RequestsExecutor } from './requests.executor';
import { CallOptions } from './requests.executor.options';
import { PipelineErrorRequestProcessingState } from './processing-states';

export class MediatorRequestsExecutor implements RequestsExecutor {
  constructor(
    private readonly _options: Pick<MediatorOptions, 'dynamicOptions'>,
    private readonly _providersManager: ProvidersManager,
    private readonly _providersInstantiator: ProvidersInstantiator,
    private readonly _requestsProvidersChainer: RequestsProvidersChainer
  ) {}

  execute<TResult>(messageProcessing: Subject<MessageProcessingState>, request: Request) {
    const providers = this._providersManager.get<RequestsProvidersSchema>(MessageTypes.REQUEST);
    const providersInstancesTask = Promise.all([
      this.getHandler(providers, request),
      this.getPipelines(providers, request),
    ]);

    return from(providersInstancesTask).pipe(
      mergeMap(([handler, pipelines]) => {
        const chain = this._requestsProvidersChainer.chain<TResult>(messageProcessing, request, pipelines, handler);
        return this.call({ messageProcessing, request, chain });
      })
    );
  }

  private getHandler(providers: RequestsProvidersSchema, request: Request) {
    const handlerType = providers.specific.get(getTypeOfMessage(request))?.handler;
    if (!handlerType) {
      throw new NoHandlerException(getTypeOfMessage(request));
    }
    return this._providersInstantiator(handlerType);
  }

  private getPipelines(providers: RequestsProvidersSchema, request: Request) {
    const requestType = getTypeOfMessage(request);
    const pipelinesTypes = [
      ...providers.global.pipelines,
      ...(requestType ? providers.specific.get(requestType)?.pipelines || [] : []),
    ];
    return Promise.all(
      pipelinesTypes.map((pipelineType) => this._providersInstantiator<IRequestPipeline<Request, any>>(pipelineType))
    );
  }

  private call<TResult>(args: CallOptions<TResult>) {
    const config = this._options.dynamicOptions ? this._options.dynamicOptions() : {};
    const requestsTimeout = config.requests?.timeout;
    return args.chain.pipe(
      requestsTimeout
        ? timeout({ each: requestsTimeout, with: () => throwError(() => new MessageTimeoutException(args.request)) })
        : tap(),
      catchError((error) => {
        args.messageProcessing.next(new PipelineErrorRequestProcessingState(error));
        return throwError(() => error);
      })
    );
  }
}
