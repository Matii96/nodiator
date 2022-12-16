import { ClassConstructor } from '../../../utils/class-constructor.interface';
import { MESSAGE_METADATA, SCOPE_OPTIONS_METADATA } from '../../constants';
import { MessageTypeInterferenceException } from '../../exceptions/message-type-interference.exception';
import { MessageMetadata } from '../../interfaces/message-metadata.interface';
import { ScopeOptions } from '../../interfaces/scope.options';
import { MessageTypes } from '../../message-types.enum';
import { REQUEST_HANDLER_METADATA } from '../constants';
import { Request } from '../interfaces/request.interface';

type RequestType = ClassConstructor<Request>;

interface RequestHandlerOptions extends ScopeOptions {
  /**
   * Specifies the request to handle.
   */
  request: RequestType;
}

/**
 * Represents a handler for given request.
 * @param request
 */
export function RequestHandler(request: RequestType): ClassDecorator;

/**
 * Represents a handler for given request.
 * @param options Extended handler options
 */
export function RequestHandler(options: RequestHandlerOptions): ClassDecorator;

export function RequestHandler(requestOrOptions: RequestType | RequestHandlerOptions): ClassDecorator {
  return (target) => {
    let requestType: RequestType;
    switch (typeof requestOrOptions) {
      case 'function':
        requestType = requestOrOptions;
        break;
      case 'object':
        requestType = requestOrOptions.request;
        Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, { scoped: requestOrOptions.scoped } as ScopeOptions, target);
        break;
    }
    Reflect.defineMetadata(REQUEST_HANDLER_METADATA, requestType, target);

    // Many handlers can be defined yet only one can be registered at the same time
    const existingMetadata: MessageMetadata = Reflect.getMetadata(MESSAGE_METADATA, requestType);
    if (existingMetadata) {
      if (existingMetadata.type !== MessageTypes.REQUEST) {
        throw new MessageTypeInterferenceException(requestType);
      }
      return;
    }

    Reflect.defineMetadata(MESSAGE_METADATA, { type: MessageTypes.REQUEST } as MessageMetadata, requestType);
  };
}
