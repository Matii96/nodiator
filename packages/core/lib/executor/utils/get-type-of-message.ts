import { Message } from '../../messages';
import { ClassConstructor } from '../../utils/class-constructor.interface';
import { PlainObjectMessageException } from '../exceptions';

export const getTypeOfMessage = (message: Message): ClassConstructor<Message> => {
  const prototype = Object.getPrototypeOf(message);
  if (prototype === Object.prototype) {
    throw new PlainObjectMessageException(message as Record<string, unknown>);
  }
  return prototype.constructor;
};
