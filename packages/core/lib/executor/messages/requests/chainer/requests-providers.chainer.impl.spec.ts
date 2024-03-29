import 'reflect-metadata';
import { delay, firstValueFrom, of, Subject } from 'rxjs';
import { TestRequest, TestRequestHandler, TestRequestPipeline } from '../../../../messages/request/requests.mocks';
import { RequestsProvidersChainer } from './requests-providers-chainer';
import { MediatorRequestsProvidersChainer } from './requests-providers.chainer.impl';

describe('RequestsProvidersChainer', () => {
  const request = new TestRequest('success');
  const pipeline = new TestRequestPipeline();
  const handler = new TestRequestHandler();
  let chainer: RequestsProvidersChainer;

  beforeEach(() => {
    chainer = new MediatorRequestsProvidersChainer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('executing chained providers', () => {
    beforeEach(() => {
      jest.spyOn(handler, 'handle').mockResolvedValueOnce(request.property);
    });

    it('should run pipeline and handler for request', (done) => {
      chainer.chain(new Subject(), request, [pipeline], handler).subscribe((result) => {
        expect(result).toEqual(request.property);
        expect(pipeline.handle).toHaveBeenCalledTimes(1);
        expect(handler.handle).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should not start execution until subscribed', (done) => {
      const chain = chainer.chain(new Subject(), request, [pipeline], handler);
      of(1)
        .pipe(delay(5))
        .subscribe(() => {
          expect(pipeline.handle).not.toHaveBeenCalled();
          expect(handler.handle).not.toHaveBeenCalled();
          chain.subscribe(() => done());
        });
    });
  });

  describe('exceptions handling', () => {
    const someException = new Error('something went wrong');

    beforeEach(() => {
      jest.spyOn(handler, 'handle').mockRejectedValueOnce(someException);
    });

    it('should throw exception', async () => {
      const task = firstValueFrom(chainer.chain(new Subject(), request, [pipeline], handler));
      expect(task).rejects.toThrowError(someException);
      try {
        await task;
      } catch {}
    });
  });
});
