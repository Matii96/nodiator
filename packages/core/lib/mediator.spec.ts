import 'reflect-metadata';
import { ProviderMock } from './providers-manager/providers-manager.mocks';
import { Mediator } from './mediator';

jest.mock('./executor/executor');

describe('Mediator', () => {
  let mediator: Mediator;

  beforeEach(() => {
    mediator = new Mediator({ providers: [ProviderMock] });
  });

  it('should execute request', async () => {
    expect(await mediator.request({})).toBeUndefined();
  });

  it('should publish event', async () => {
    expect(await mediator.publish({}, {})).toBeUndefined();
  });
});
