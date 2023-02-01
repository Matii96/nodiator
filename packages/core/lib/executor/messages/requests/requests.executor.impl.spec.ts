import 'reflect-metadata';
import { delay, firstValueFrom, Observable, of, Subject } from 'rxjs';
import { TestRequest, TestRequestHandler } from '../../../messages/request/requests.mocks';
import { RequestsProvidersSchema } from '../../../providers-manager';
import { ProvidersManager } from '../../../providers-manager/providers-manager';
import { ProvidersManagerMock } from '../../../providers-manager/providers-manager.mocks';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { RequestsProvidersChainerMock } from '../../executor.mocks';
import { MessageExecutor } from '../shared/message-executor';
import { ProvidersInstantiator } from '../../types/providers-instantiator.port';
import { RequestsProvidersChainer } from './chainer/requests-providers-chainer';
import { MediatorRequestsExecutor } from './requests.executor.impl';

describe('RequestsExecutor', () => {
  const request = new TestRequest('success');
  const handler = new TestRequestHandler();
  const providersInstantiatorMock: ProvidersInstantiator = () => handler as any;
  let providersManager: ProvidersManager;
  let requestsProvidersChainer: RequestsProvidersChainer;
  let executor: MessageExecutor<TestRequest, Observable<string>>;

  beforeEach(() => {
    providersManager = new ProvidersManagerMock();
    const specific = new Map();
    specific.set(TestRequest, { pipelines: [], handler: [TestRequestHandler] });
    jest
      .spyOn(providersManager, 'get')
      .mockReturnValue({ global: { pipelines: [] }, specific } as RequestsProvidersSchema);

    requestsProvidersChainer = new RequestsProvidersChainerMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requests handling', () => {
    beforeEach(() => {
      executor = new MediatorRequestsExecutor(
        { dynamicOptions: () => ({}) },
        providersManager,
        providersInstantiatorMock,
        requestsProvidersChainer
      );
    });

    it('should return "success"', (done) => {
      jest.spyOn(requestsProvidersChainer, 'chain').mockReturnValueOnce(of(request.property));
      executor.execute(new Subject(), request).subscribe((result) => {
        expect(result).toBe(request.property);
        done();
      });
    });
  });

  describe('timeouts handling', () => {
    beforeEach(() => {
      executor = new MediatorRequestsExecutor(
        { dynamicOptions: () => ({ requests: { timeout: 1 } }) },
        providersManager,
        providersInstantiatorMock,
        requestsProvidersChainer
      );
      jest.spyOn(requestsProvidersChainer, 'chain').mockReturnValueOnce(of(request.property).pipe(delay(20)));
    });

    it('should throw timeout exception', async () => {
      const task = firstValueFrom(executor.execute(new Subject(), request));
      expect(task).rejects.toThrow(MessageTimeoutException);
      try {
        await task;
      } catch {}
    });
  });
});
