import { MediatorException } from '../../exceptions';
import { IMessage } from '../../messages/interfaces/message.interface';

export class MessageTimeoutException extends MediatorException {
  constructor(message: IMessage) {
    super(`${message.constructor.name} execution has timed out`);
  }
}
