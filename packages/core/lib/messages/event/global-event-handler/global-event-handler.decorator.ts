import { SCOPE_OPTIONS_METADATA } from '../../constants';
import { ScopeOptions } from '../../interfaces/scope.options';
import { GLOBAL_EVENT_HANDLER_METADATA } from '../constants';

export function GlobalEventHandler(options?: ScopeOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(GLOBAL_EVENT_HANDLER_METADATA, true, target);
    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, options, target);
  };
}
