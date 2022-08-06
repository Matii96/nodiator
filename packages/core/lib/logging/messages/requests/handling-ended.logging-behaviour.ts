import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../mediator/mediator.options';
import { IRequestProcessingState } from '../../../executor/messages/requests/interfaces/request-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';

export class RequestsHandlingEndedLoggingBehaviour implements ILoggingBehaviour {
  constructor(private readonly logger: IMediatorLogger, source: Observable<IRequestProcessingState>) {
    source
      .pipe(filter((state) => state.messageType === MessageTypes.REQUEST && state.provider && Boolean(state.result)))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IRequestProcessingState) {
    this.logger.debug(
      ` -- finished ${state.message.constructor.name} (id=${state.id}}) handling by ${state.provider.constructor.name}`
    );
  }
}
