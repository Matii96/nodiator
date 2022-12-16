import { MediatorException } from '../../exceptions';
import { Message } from '../../messages/interfaces/message.interface';

export class MessageTimeoutException extends MediatorException {
  constructor(message: Message) {
    super(`${message.constructor.name} execution has timed out`);
  }
}
