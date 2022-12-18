import { Type } from '@nestjs/common';
import { MEDIATOR_TOKEN } from './constants';

const getToken = (name: string) => `Nodiator_${name}`;

export const getMediatorToken = (namespace: string | symbol | Type) => {
  if (typeof namespace === 'string') {
    return getToken(namespace);
  }
  if (typeof namespace === 'symbol') {
    return namespace;
  }

  let token: symbol = Reflect.getMetadata(MEDIATOR_TOKEN, namespace);
  if (!token) {
    token = Symbol(getToken(namespace.name));
    Reflect.defineMetadata(MEDIATOR_TOKEN, token, namespace);
  }

  return token;
};
