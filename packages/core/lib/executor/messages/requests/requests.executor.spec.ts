import 'reflect-metadata';
import { Subject } from 'rxjs';
import { IRequest } from '../../../messages';
import { TestRequest, TestRequestHandler } from '../../../messages/messages.mocks';
import { IRequestsProvidersSchema } from '../../../providers-manager';
import { IProvidersManager } from '../../../providers-manager/ports/providers-manager.port';
import { ProvidersManagerMock } from '../../../providers-manager/providers-manager.mocks';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { RequestsProvidersChainerMock } from '../../executor.mocks';
import { IMessageExecutor } from '../../ports/message-executor.port';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { IRequestProcessingState } from './interfaces/request-processing-state.interface';
import { IRequestsProvidersChainer } from './ports/requests-providers-chainer.port';
import { RequestsExecutor } from './requests.executor';

describe('RequestsExecutor', () => {
  const id = 'id';
  const request = new TestRequest('success');
  const handler = new TestRequestHandler();
  const providersInstantiatorMock: ProvidersInstantiator = () => handler as any;
  let subject: Subject<IRequestProcessingState>;
  let providersManager: IProvidersManager;
  let eventStates: IRequestProcessingState[];
  let requestsProvidersChainer: IRequestsProvidersChainer;
  let executor: IMessageExecutor<IRequest, any>;

  beforeEach(() => {
    providersManager = new ProvidersManagerMock();
    const specific = new Map();
    specific.set(TestRequest, { pipelines: [], handler: [TestRequestHandler] });
    jest
      .spyOn(providersManager, 'get')
      .mockReturnValue({ global: { pipelines: [] }, specific } as IRequestsProvidersSchema);

    subject = new Subject();
    eventStates = [];
    subject.subscribe((state) => eventStates.push(state));

    requestsProvidersChainer = new RequestsProvidersChainerMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requests handling', () => {
    beforeEach(() => {
      executor = new RequestsExecutor(
        subject,
        {},
        providersManager,
        providersInstantiatorMock,
        requestsProvidersChainer
      );
    });

    it('should return "success"', async () => {
      jest.spyOn(requestsProvidersChainer, 'chain').mockReturnValueOnce(async () => request.property);
      expect(await executor.execute(id, request)).toBe(request.property);
    });
  });

  describe('timeouts handling', () => {
    beforeEach(() => {
      executor = new RequestsExecutor(
        subject,
        { requestsTimeout: 1 },
        providersManager,
        providersInstantiatorMock,
        requestsProvidersChainer
      );
      jest
        .spyOn(requestsProvidersChainer, 'chain')
        .mockImplementationOnce(() => () => new Promise((resolve) => setTimeout(resolve, 5)));
    });

    it('should throw timeout exception', async () => {
      const task = executor.execute(id, request);
      expect(task).rejects.toThrow(MessageTimeoutException);
      try {
        await task;
      } catch {}
    });
  });
});
