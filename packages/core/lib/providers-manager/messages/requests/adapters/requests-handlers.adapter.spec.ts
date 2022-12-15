import { TestRequest, TestRequestHandler } from '../../../../messages/request/messages.mocks';
import { IRequestsProvidersSchema } from '../interfaces';
import { RequestsHandlersAdapter } from './requests-handlers.adapter';

describe('RequestsHandlersAdapter', () => {
  let adapter: RequestsHandlersAdapter;

  beforeEach(() => {
    adapter = new RequestsHandlersAdapter();
  });

  it('should register providers', () => {
    const adaptedProviders: IRequestsProvidersSchema = { global: { pipelines: [] }, specific: new Map() };
    adapter.register(adaptedProviders, TestRequestHandler, TestRequest);

    expect(adaptedProviders.specific.has(TestRequest)).toBe(true);
  });
});
