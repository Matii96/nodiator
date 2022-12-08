import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { MediatorException } from '../../../../exceptions/mediator.exception';
import { IRequest } from '../../../../messages/request/interfaces/request.interface';

export class NoHandlerException extends MediatorException {
  constructor(request: ClassConstructor<IRequest>) {
    super(`${request.name} has no handler registered`);
  }
}
