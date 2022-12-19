import { TestEvent, TestEventHandler } from '../../../../messages/event/events.mocks';
import { EventsProvidersSchema } from '../interfaces';
import { EventsHandlersAdapter } from './events-handlers.adapter';

describe('EventsHandlersAdapter', () => {
  let adapter: EventsHandlersAdapter;

  beforeEach(() => {
    adapter = new EventsHandlersAdapter();
  });

  it('should register providers', () => {
    const adaptedProviders: EventsProvidersSchema = { global: { handlers: [] }, specific: new Map() };
    adapter.register(adaptedProviders, TestEventHandler, new Set([TestEvent]));

    expect(adaptedProviders.specific.has(TestEvent)).toBe(true);
  });
});
