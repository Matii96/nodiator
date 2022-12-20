import { MessageTypes } from '../messages';
import { MessageTypeProvidersSchema } from './interfaces/message-type-providers-schema.interface';
import { MessageTypeProvidersSchemaDefiner } from './messages/shared/message-type-providers-schema-definer.port';
import { ProviderTypeAdapter } from './messages/shared/provider-type-adapter.port';
import { ProvidersManager } from './providers-manager';

export class ProvidersManagerMock implements ProvidersManager {
  list = jest.fn();
  get = jest.fn();
  register = jest.fn(() => []);
}

export class MessageTypeProvidersSchemaDefinerMock implements MessageTypeProvidersSchemaDefiner {
  readonly messageType = MessageTypes.REQUEST;
  define = jest.fn(() => ({}));
}

const metadataKeyMock = Symbol('metadataKeyMock');
export class ProviderTypeAdapterMock implements ProviderTypeAdapter<MessageTypeProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = metadataKeyMock;
  register = jest.fn();
}

export class ProviderMock {}
Reflect.defineMetadata(metadataKeyMock, {}, ProviderMock);
