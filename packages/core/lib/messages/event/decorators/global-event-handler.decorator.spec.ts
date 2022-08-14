import 'reflect-metadata';
import { GLOBAL_EVENT_HANDLER_METADATA, SCOPE_OPTIONS_METADATA } from '../../constants';
import { ScopeOptions } from '../../interfaces';
import { TestEventHandler } from '../../messages.mocks';
import { GlobalEventHandler } from './global-event-handler.decorator';

describe('GlobalEventHandler', () => {
  it('should register metadata', () => {
    GlobalEventHandler({ scoped: true })(TestEventHandler);
    expect(Reflect.getMetadata(GLOBAL_EVENT_HANDLER_METADATA, TestEventHandler)).toEqual(true);
    expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestEventHandler)).toEqual({ scoped: true } as ScopeOptions);
  });
});
