import { TestRequest, TestRequestHandler } from '../../../../messages/request/requests.mocks';
import { RequestsProvidersSchema } from '../interfaces';
import { RequestsHandlersAdapter } from './requests-handlers.adapter';

describe('RequestsHandlersAdapter', () => {
  let adapter: RequestsHandlersAdapter;

  beforeEach(() => {
    adapter = new RequestsHandlersAdapter();
  });

  it('should register providers', () => {
    const adaptedProviders: RequestsProvidersSchema = { global: { pipelines: [] }, specific: new Map() };
    adapter.register(adaptedProviders, TestRequestHandler, TestRequest);

    expect(adaptedProviders.specific.has(TestRequest)).toBe(true);
  });
});
