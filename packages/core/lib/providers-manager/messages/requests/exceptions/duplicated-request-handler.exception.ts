import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { MediatorException } from '../../../../exceptions/mediator.exception';
import { IRequest } from '../../../../messages/request/interfaces/request.interface';

export class DuplicatedRequestHandlerException extends MediatorException {
  constructor(request: ClassConstructor<IRequest>) {
    super(`Duplicated request handler for ${request.name}`);
  }
}
