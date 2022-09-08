import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../config/mediator.options';
import { IRequestProcessingState } from '../../../executor/messages/requests/interfaces/request-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';

export class RequestsHandlingStartedLoggingBehaviour implements ILoggingBehaviour {
  constructor(private readonly logger: IMediatorLogger, source: Observable<IRequestProcessingState>) {
    source
      .pipe(filter((state) => state.messageType === MessageTypes.REQUEST && state.provider && !state.response))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IRequestProcessingState) {
    this.logger.debug(
      ` -- handling ${state.message.constructor.name} (id=${state.id}}) with ${state.provider.constructor.name}`
    );
  }
}
