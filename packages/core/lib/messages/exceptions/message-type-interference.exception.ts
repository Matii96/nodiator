import { ClassConstructor } from '../../utils/class-constructor.interface';
import { IMessage } from '../interfaces';
import { MediatorException } from '../../exceptions/mediator.exception';

export class MessageTypeInterferenceException extends MediatorException {
  constructor(message: ClassConstructor<IMessage>) {
    super(`Message ${message.name} cannot be treated as event and request at the same time`);
  }
}
