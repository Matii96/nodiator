import { Type } from '../utils/type.interface';
import { IMessageTypeExplorer } from './ports/message-type-explorer.port';
import { RequestsExplorerService } from './messages/requests/requests-explorer.service';
import { EventsExplorerService } from './messages/events/events-explorer.service';
import { Explorer } from './explorer';

export class ExplorerFactory {
  private readonly messagesExplorersTypes: Type<IMessageTypeExplorer>[] = [
    RequestsExplorerService,
    EventsExplorerService,
  ];

  create() {
    const messagesExplorers = this.messagesExplorersTypes.map((explorerType) => new explorerType());
    return new Explorer(messagesExplorers);
  }
}
