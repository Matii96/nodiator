import { Inject } from '@nestjs/common';
import { getMediatorToken } from '../utils/get-mediator-token.util';

/**
 * Injects Mediator instance from the given namespace if specified.
 * @param namespace
 */
export const InjectMediator = (namespace?: string): ParameterDecorator => Inject(getMediatorToken(namespace));
