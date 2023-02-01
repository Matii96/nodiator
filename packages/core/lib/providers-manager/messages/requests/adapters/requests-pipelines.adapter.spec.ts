import { TestRequest, TestRequestPipeline } from '../../../../messages/request/requests.mocks';
import { RequestsProvidersSchema } from '../interfaces';
import { RequestsPipelinesAdapter } from './requests-pipelines.adapter';

describe('RequestsPipelinesAdapter', () => {
  let adapter: RequestsPipelinesAdapter;

  beforeEach(() => {
    adapter = new RequestsPipelinesAdapter();
  });

  it('should register providers', () => {
    const adaptedProviders: RequestsProvidersSchema = { global: { pipelines: [] }, specific: new Map() };
    adapter.register(adaptedProviders, TestRequestPipeline, new Set([TestRequest]));
    expect(adaptedProviders.specific.has(TestRequest)).toBe(true);
  });
});
