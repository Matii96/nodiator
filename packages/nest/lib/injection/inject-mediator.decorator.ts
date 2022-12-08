import { Inject } from '@nestjs/common';
import { getMediatorToken } from './get-mediator-token.factory';

/**
 * Injects Mediator instance from the given namespace if specified.
 * @param namespace
 */
export const InjectMediator = (namespace?: string): ParameterDecorator => Inject(getMediatorToken(namespace));