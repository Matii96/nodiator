import { MediatorException } from '../../exceptions';

export class PlainObjectMessageException extends MediatorException {
  constructor(object: Object) {
    super(`Can't use plain object ${JSON.stringify(object)} as a message`);
  }
}
