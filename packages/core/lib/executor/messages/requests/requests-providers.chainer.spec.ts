import 'reflect-metadata';
import { Subject } from 'rxjs';
import { TestRequest, TestRequestHandler, TestRequestPipeline } from '../../../messages/messages.mocks';
import { IRequestProcessingState } from './interfaces/request-processing-state.interface';
import { IRequestsProvidersChainer } from './ports/requests-providers-chainer.port';
import { RequestsProvidersChainer } from './requests-providers.chainer';

describe('RequestsProvidersChainer', () => {
  const id = 'id';
  const request = new TestRequest('success');
  const pipeline = new TestRequestPipeline();
  const handler = new TestRequestHandler();
  let subject: Subject<IRequestProcessingState>;
  let chainer: IRequestsProvidersChainer;

  beforeEach(() => {
    subject = new Subject();
    chainer = new RequestsProvidersChainer(subject);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('executing chained providers', () => {
    beforeEach(() => {
      jest.spyOn(handler, 'handle').mockResolvedValueOnce(request.property);
    });

    it('should run pipeline and handler for request', async () => {
      const chain = chainer.chain(id, request, [pipeline], handler);
      expect(await chain()).toEqual(request.property);
      expect(pipeline.handle).toHaveBeenCalledTimes(1);
      expect(handler.handle).toHaveBeenCalledTimes(1);
    });
  });

  describe('exceptions handling', () => {
    const someException = new Error('something went wrong');

    beforeEach(() => {
      jest.spyOn(handler, 'handle').mockRejectedValueOnce(someException);
    });

    it('should throw timeout exception', async () => {
      const task = chainer.chain(id, request, [pipeline], handler)();
      expect(task).rejects.toThrowError(someException);
      try {
        await task;
      } catch {}
    });
  });
});
