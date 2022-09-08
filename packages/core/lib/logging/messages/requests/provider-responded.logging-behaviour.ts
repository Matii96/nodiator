import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../config/mediator.options';
import { IRequestProcessingState } from '../../../executor/messages/requests/interfaces/request-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';

export class RequestsProviderRespondedLoggingBehaviour implements ILoggingBehaviour {
  constructor(private readonly _logger: IMediatorLogger, source: Observable<IRequestProcessingState>) {
    source
      .pipe(filter((state) => state.messageType === MessageTypes.REQUEST && state.provider && Boolean(state.response)))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IRequestProcessingState) {
    this._logger.debug(
      ` -- ${state.provider.constructor.name} responded to ${state.message.constructor.name} (id=${state.id}})`
    );
  }
}
