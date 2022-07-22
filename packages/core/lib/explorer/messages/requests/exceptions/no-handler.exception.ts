import { Type } from '../../../../utils/type.interface';
import { MediatorException } from '../../../../exceptions/mediator.exception';
import { IRequest } from '../../../../messages/request/interfaces/request.interface';

export class NoHandlerException extends MediatorException {
  constructor(request: Type<IRequest>) {
    super(`${request.name} has no handler registered`);
  }
}
