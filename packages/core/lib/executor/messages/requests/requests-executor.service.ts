import { catchError, defer, lastValueFrom, Subject, tap, throwError, timeout, TimeoutError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Type } from '../../../utils/type.interface';
import { IMessagesProviders } from '../../../explorer/interfaces/explored-providers.interface';
import { NoHandlerException } from '../../../explorer/messages/requests/exceptions/no-handler.exception';
import {
  IRequestsProviders,
  IRequestsSpecificProviders,
} from '../../../explorer/messages/requests/interfaces/requests-providers.interface';
import { MediatorOptions } from '../../../mediator.options';
import { IRequest, IRequestPipeline } from '../../../messages';
import { MessageTypes } from '../../../messages/message-types.enum';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { IMessageExecutor } from '../../ports/message-executor.port';
import { IMessageProcessingState } from '../../interfaces/message-processing-state.interface';
import { ExecutorUtils } from '../../executor-utils';
import { IRequestsProvidersChainer } from './ports/requests-providers-chainer.port';

export class RequestsExecutorService implements IMessageExecutor<IRequest, any> {
  constructor(
    private readonly subject: Subject<IMessageProcessingState>,
    private readonly mediatorOptions: MediatorOptions,
    private readonly messagesProviders: IMessagesProviders,
    private readonly providersInstantiator: ProvidersInstantiator,
    private readonly requestsProvidersChainer: IRequestsProvidersChainer
  ) {}

  async execute<TResult>(request: IRequest) {
    const id = uuidv4();
    const providers = this.messagesProviders[MessageTypes.REQUEST] as IRequestsProviders;
    const handler = await this.getHandler(providers, request);
    const pipelines = await this.getPipelines(providers, request);
    const chain = this.requestsProvidersChainer.chain<TResult>(id, request, pipelines, handler);
    return this.call(request, id, chain);
  }

  private getHandler(providers: IRequestsProviders, request: IRequest) {
    const handlerType = this.getSpecificHandler(providers.specific, request);
    if (!handlerType) {
      throw new NoHandlerException(ExecutorUtils.getTypeOfMessage(request));
    }
    return this.providersInstantiator(handlerType);
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
          this.subject.next({ id, type: MessageTypes.REQUEST, data: request, error });
          return throwError(() => error);
        })
      )
    );
  }
}
