import { MessageTypes } from '../messages';
import { IMessageTypeProvidersSchema } from './interfaces/message-type-providers-schema.interface';
import { IMessageTypeProvidersSchemaDefiner } from './ports/message-type-providers-schema-definer.port';
import { IProviderTypeAdapter } from './ports/provider-type-adapter.port';

export class MessageTypeProvidersSchemaDefinerMock implements IMessageTypeProvidersSchemaDefiner {
  readonly messageType = MessageTypes.REQUEST;
  define = jest.fn(() => ({}));
}

const metadataKeyMock = 'metadataKeyMock';
export class ProviderTypeAdapterMock implements IProviderTypeAdapter<IMessageTypeProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = metadataKeyMock;
  register = jest.fn();
}

export class ProviderMock {}
Reflect.defineMetadata(metadataKeyMock, {}, ProviderMock);
