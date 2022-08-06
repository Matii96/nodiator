import { catchError, defer, lastValueFrom, Subject, tap, throwError, timeout, TimeoutError } from 'rxjs';
import { MediatorOptions } from '../../../mediator/mediator.options';
import { IRequest, IRequestPipeline } from '../../../messages';
import { IRequestsProvidersSchema } from '../../../providers-manager/messages/requests/interfaces/requests-providers-schema.interface';
import { MessageTypes } from '../../../messages/message-types.enum';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { IMessageExecutor } from '../../ports/message-executor.port';
import { ExecutorUtils } from '../../executor-utils';
import { IRequestsProvidersChainer } from './ports/requests-providers-chainer.port';
import { NoHandlerException } from './exceptions/no-handler.exception';
import { IRequestProcessingState } from './interfaces/request-processing-state.interface';
import { IProvidersManager } from '../../../providers-manager/ports/providers-manager.port';

export class RequestsExecutorService implements IMessageExecutor<IRequest, any> {
  constructor(
    private readonly subject: Subject<IRequestProcessingState>,
    private readonly mediatorOptions: MediatorOptions,
    private readonly providersManager: IProvidersManager,
    private readonly providersInstantiator: ProvidersInstantiator,
    private readonly requestsProvidersChainer: IRequestsProvidersChainer
  ) {}

  async execute<TResult>(id: string, request: IRequest) {
    const providers = this.providersManager.get<IRequestsProvidersSchema>(MessageTypes.REQUEST);
    const [handler, pipelines] = await Promise.all([
      this.getHandler(providers, request),
      this.getPipelines(providers, request),
    ]);
    const chain = this.requestsProvidersChainer.chain<TResult>(id, request, pipelines, handler);
    return this.call(request, id, chain);
  }

  private getHandler(providers: IRequestsProvidersSchema, request: IRequest) {
    const handlerType = providers.specific.get(ExecutorUtils.getTypeOfMessage(request))?.handler;
    if (!handlerType) {
      throw new NoHandlerException(ExecutorUtils.getTypeOfMessage(request));
    }
    return this.providersInstantiator(handlerType);
  }

  private getPipelines(providers: IRequestsProvidersSchema, request: IRequest) {
    const requestTypeId = ExecutorUtils.getTypeOfMessage(request);
    const pipelinesTypes = [
      ...providers.global.pipelines,
      ...(requestTypeId ? providers.specific.get(requestTypeId).pipelines : []),
    ];
    return Promise.all(
      pipelinesTypes.map((pipelineType) => this.providersInstantiator<IRequestPipeline<IRequest, any>>(pipelineType))
    );
  }

  private call<TResult>(request: IRequest, id: string, next: () => Promise<TResult>) {
    return lastValueFrom(
      defer(next).pipe(
        this.mediatorOptions.requestsTimeout ? timeout(this.mediatorOptions.requestsTimeout) : tap(),
        catchError((err) => {
          const error = err instanceof TimeoutError ? new MessageTimeoutException(request) : err;
          this.subject.next({ id, messageType: MessageTypes.REQUEST, message: request, error });
          return throwError(() => error);
        })
      )
    );
  }
}
