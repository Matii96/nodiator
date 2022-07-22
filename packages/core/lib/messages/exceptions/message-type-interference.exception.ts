import { MediatorException } from '../../exceptions/mediator.exception';

export class MessageTypeInterferenceException extends MediatorException {
  constructor(message: Function) {
    super(`Message ${message.name} cannot be treated as event and request at the same time`);
  }
}
