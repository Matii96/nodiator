import { Type } from '../../utils/type.interface';
import { IMessage } from '../interfaces';
import { MediatorException } from '../../exceptions/mediator.exception';

export class MessageTypeInterferenceException extends MediatorException {
  constructor(message: Type<IMessage>) {
    super(`Message ${message.name} cannot be treated as event and request at the same time`);
  }
}
