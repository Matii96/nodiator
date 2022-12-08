import { firstValueFrom, lastValueFrom } from 'rxjs';
import { IMediator, MediatorFactory } from '../lib';
import { TestEvent, TestEventHandler, TestGlobalEventHandler } from './events/events.mocks';
import { TestRequest, TestRequestHandler } from './requests/requests.mocks';

describe('@nodiator/core common (e2e)', () => {
  const testEvent = new TestEvent();
  const testRequest = new TestRequest('success');
  let mediator: IMediator;

  beforeEach(() => {
    mediator = MediatorFactory.create();
    mediator.providers.register(TestRequestHandler, TestGlobalEventHandler, TestEventHandler);
  });

  it('should manually register handler and execute it', async () => {
    const requestResult = await firstValueFrom(mediator.request<string>(testRequest));
    expect(requestResult).toBe(testRequest.property);

    await lastValueFrom(mediator.publish(testEvent));
    const handle = expect(TestGlobalEventHandler.handle);
    handle.toHaveBeenCalledTimes(1);
    handle.toHaveBeenCalledWith(testEvent);
  });
});
