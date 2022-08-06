import { GLOBAL_REQUEST_PIPELINE_METADATA, SCOPE_OPTIONS_METADATA } from '../../constants';
import { ScopeOptions } from '../../interfaces/scope.options';

/**
 * Represents global pipeline executable before each request or event is handled.
 * @param options options specifying scope of injectable
 */
export function GlobalRequestPipeline(options?: ScopeOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(GLOBAL_REQUEST_PIPELINE_METADATA, true, target);
    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, options, target);
  };
}
