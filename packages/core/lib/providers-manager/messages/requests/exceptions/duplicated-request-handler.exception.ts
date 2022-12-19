import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { MediatorException } from '../../../../exceptions/mediator.exception';
import { Request } from '../../../../messages/request/interfaces/request.interface';

export class DuplicatedRequestHandlerException extends MediatorException {
  constructor(request: ClassConstructor<Request>) {
    super(`Duplicated request handler for ${request.name}`);
  }
}
