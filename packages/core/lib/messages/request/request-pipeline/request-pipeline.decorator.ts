import { ClassConstructor } from '../../../utils/class-constructor.interface';
import { SCOPE_OPTIONS_METADATA } from '../../constants';
import { ScopeOptions } from '../../interfaces/scope.options';
import { Request } from '../request';
import { REQUEST_PIPELINE_METADATA } from '../constants';

type RequestType = ClassConstructor<Request>;

interface RequestPipelineSingleOptions extends ScopeOptions {
  /**
   * Specifies the request which execution will be preceded by the pipeline.
   */
  request: RequestType;
}

interface RequestPipelineMultipleOptions extends ScopeOptions {
  /**
   * Specifies set of requests which execution will be preceded by the pipeline.
   */
  requests: RequestType[];
}

/**
 * Represents pipeline executable before given request is handled.
 * @param requests
 */
export function RequestPipeline(...requests: RequestType[]): ClassDecorator;

/**
 * Represents pipeline executable before given request is handled.
 * @param options Extended pipeline options
 */
export function RequestPipeline(options: RequestPipelineSingleOptions): ClassDecorator;

/**
 * Represents pipeline executable before given request is handled.
 * @param options Extended pipeline options
 */
export function RequestPipeline(options: RequestPipelineMultipleOptions): ClassDecorator;

export function RequestPipeline(
  ...requestOrOptions: (RequestType | RequestPipelineSingleOptions | RequestPipelineMultipleOptions)[]
): ClassDecorator {
  return (target) => {
    switch (typeof requestOrOptions[0]) {
      case 'function':
        Reflect.defineMetadata(REQUEST_PIPELINE_METADATA, new Set(requestOrOptions), target);
        break;
      case 'object':
        Reflect.defineMetadata(
          REQUEST_PIPELINE_METADATA,
          new Set(
            (<RequestPipelineSingleOptions>requestOrOptions[0]).request
              ? [(<RequestPipelineSingleOptions>requestOrOptions[0]).request]
              : (<RequestPipelineMultipleOptions>requestOrOptions[0]).requests
          ),
          target
        );
        Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, { scoped: requestOrOptions[0].scoped } as ScopeOptions, target);
        break;
    }
  };
}
