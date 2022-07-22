import { catchError, defer, lastValueFrom, tap, throwError, timeout, TimeoutError } from 'rxjs';
import { Type } from '../../../utils/type.interface';
import { IMessagesProviders } from '../../../explorer/interfaces/explored-providers.interface';
import { NoHandlerException } from '../../../explorer/messages/requests/exceptions/no-handler.exception';
import {
  IRequestsProviders,
  IRequestsSpecificProviders,
} from '../../../explorer/messages/requests/interfaces/requests-providers.interface';
import { MediatorOptions } from '../../../mediator.options';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../messages';
import { MessageTypes } from '../../../messages/message-types.enum';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { IProvidersInstantiator } from '../../interfaces/providers-instantiator.interface';
import { IMessageExecutor } from '../../interfaces/message-executor.interface';
import { ExecutorUtils } from '../../executor-utils';

export class RequestsExecutorService implements IMessageExecutor<IRequest, any> {
  constructor(
    private readonly mediatorOptions: MediatorOptions,
    private readonly messagesProviders: IMessagesProviders,
    private readonly providersInstantiator: IProvidersInstantiator
  ) {}

  async execute<TResult>(request: IRequest) {
    const providers = this.messagesProviders[MessageTypes.REQUEST] as IRequestsProviders;
    const handler = await this.getHandler(providers, request);
    const pipelines = await this.getPipelines(providers, request);
    return this.chainPipelines<TResult>(pipelines, handler, request);
  }

  private getHandler(providers: IRequestsProviders, request: IRequest) {
    const handlerType = this.getSpecificHandler(providers.specific, request);
    if (!handlerType) {
      throw new NoHandlerException(ExecutorUtils.getTypeOfMessage(request));
    }
    return this.providersInstantiator.instantiate(handlerType);
  }

  private getSpecificHandler(specificProviders: Map<Type<IRequest>, IRequestsSpecificProviders>, request: IRequest) {
    return specificProviders.get(ExecutorUtils.getTypeOfMessage(request))?.handler;
  }

  private getPipelines(providers: IRequestsProviders, request: IRequest) {
    const requestTypeId = ExecutorUtils.getTypeOfMessage(request);
    const pipelinesTypes = [
      ...providers.global.pipelines,
      ...(requestTypeId ? providers.specific.get(requestTypeId).pipelines : []),
    ];
    return Promise.all(pipelinesTypes.map((pipelineType) => this.providersInstantiator.instantiate(pipelineType)));
  }

  private chainPipelines<TResult>(
    pipelines: IRequestPipeline<IRequest, TResult>[],
    handler: IRequestHandler<IRequest, TResult>,
    request: IRequest
  ) {
    let next = () => handler.handle(request);
    for (let idx = pipelines.length - 1; idx >= 0; idx--) {
      const currentNext = next;
      next = () => pipelines[idx].handle(request, currentNext);
    }
    return lastValueFrom(
      defer(next).pipe(
        this.mediatorOptions.requestsTimeout ? timeout(this.mediatorOptions.requestsTimeout) : tap(),
        catchError((err) =>
          throwError(() => (err instanceof TimeoutError ? new MessageTimeoutException(request) : err))
        )
      )
    );
  }
}
