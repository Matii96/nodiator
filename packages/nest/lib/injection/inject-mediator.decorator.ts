import { Inject, Type } from '@nestjs/common';
import { MEDIATOR_MODULE_FEATURE_INSTANCE } from '../feature/constants';
import { getMediatorToken } from './get-mediator-token.factory';

/**
 * Injects mediator instance.
 * @param {string} namespace Custom instance identifier. Allows to import mediator from outside of current module.
 */
export const InjectMediator = (namespace?: string | symbol | Type) =>
  Inject(namespace ? getMediatorToken(namespace) : MEDIATOR_MODULE_FEATURE_INSTANCE);
