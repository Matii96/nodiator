import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { MediatorException } from '../../../../exceptions/mediator.exception';
import { Request } from '../../../../messages/request/interfaces/request.interface';

export class NoHandlerException extends MediatorException {
  constructor(request: ClassConstructor<Request>) {
    super(`${request.name} has no handler registered`);
  }
}
