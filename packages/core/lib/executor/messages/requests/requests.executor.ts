import { catchError, from, mergeMap, Subject, tap, throwError, timeout } from 'rxjs';
import { IRequest, IRequestPipeline } from '../../../messages';
import { IRequestsProvidersSchema } from '../../../providers-manager/messages/requests/interfaces/requests-providers-schema.interface';
import { MessageTypes } from '../../../messages/message-types.enum';
import { IProvidersManager } from '../../../providers-manager/ports/providers-manager.port';
import { MediatorOptions } from '../../../options/mediator.options';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { ExecutorUtils } from '../../utils/executor-utils';
import { IMessageProcessingState } from '../../message-processing/message-processing-state.interface';
import { IRequestsProvidersChainer } from './ports/requests-providers-chainer.port';
import { NoHandlerException } from './exceptions/no-handler.exception';
import { IRequestsExecutor } from './ports/requests.executor.port';
import { CallOptions } from './requests.executor.options';
import { PipelineErrorRequestProcessingState } from './processing-states';

export class RequestsExecutor implements IRequestsExecutor {
  constructor(
    private readonly _options: MediatorOptions,
    private readonly _providersManager: IProvidersManager,
    private readonly _providersInstantiator: ProvidersInstantiator,
    private readonly _requestsProvidersChainer: IRequestsProvidersChainer
  ) {}

  execute<TResult>(messageProcessing: Subject<IMessageProcessingState>, request: IRequest) {
    const providers = this._providersManager.get<IRequestsProvidersSchema>(MessageTypes.REQUEST);
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

  private getHandler(providers: IRequestsProvidersSchema, request: IRequest) {
    const handlerType = providers.specific.get(ExecutorUtils.getTypeOfMessage(request))?.handler;
    if (!handlerType) {
      throw new NoHandlerException(ExecutorUtils.getTypeOfMessage(request));
    }
    return this._providersInstantiator(handlerType);
  }

  private getPipelines(providers: IRequestsProvidersSchema, request: IRequest) {
    const requestType = ExecutorUtils.getTypeOfMessage(request);
    const pipelinesTypes = [
      ...providers.global.pipelines,
      ...(requestType ? providers.specific.get(requestType)?.pipelines || [] : []),
    ];
    return Promise.all(
      pipelinesTypes.map((pipelineType) => this._providersInstantiator<IRequestPipeline<IRequest, any>>(pipelineType))
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
