import { IMessage } from '../../messages/interfaces/message.interface';
import { ClassConstructor } from '../../utils/class-constructor.interface';
import { PlainObjectMessageException } from '../exceptions/plain-object-message.exception';

export class ExecutorUtils {
  static getTypeOfMessage(message: IMessage): ClassConstructor<IMessage> {
    const prototype = Object.getPrototypeOf(message);
    if (prototype === Object.prototype) {
      throw new PlainObjectMessageException(message as Record<string, unknown>);
    }
    return prototype.constructor;
  }

  static isPromise(p: any) {
    return p && typeof p === 'object' && typeof p.then === 'function';
  }
}
