import { IMessage } from '../messages/interfaces/message.interface';
import { Type } from '../utils/type.interface';
import { PlainObjectMessageException } from './exceptions/plain-object-message.exception';

export class ExecutorUtils {
  static getTypeOfMessage(message: IMessage): Type<IMessage> {
    const prototype = Object.getPrototypeOf(message);
    if (prototype === Object.prototype) {
      throw new PlainObjectMessageException(message);
    }
    return prototype.constructor;
  }
}
