import { TestRequest, TestRequestHandler } from '../../../../messages/messages.mocks';
import { IRequestsProvidersSchema } from '../interfaces';
import { RequestsPipelinesAdapter } from './requests-pipelines.adapter';

describe('RequestsPipelinesAdapter', () => {
  let adapter: RequestsPipelinesAdapter;

  beforeEach(() => {
    adapter = new RequestsPipelinesAdapter();
  });

  it('should register providers', () => {
    const adaptedProviders: IRequestsProvidersSchema = { global: { pipelines: [] }, specific: new Map() };
    adapter.register(adaptedProviders, TestRequestHandler, new Set([TestRequest]));

    expect(adaptedProviders.specific.has(TestRequest)).toBe(true);
  });
});