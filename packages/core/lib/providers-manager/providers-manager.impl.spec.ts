import 'reflect-metadata';
import { ProviderTypeAdapter } from './messages/shared/provider-type-adapter.port';
import { MessageTypeProvidersSchema } from './interfaces/message-type-providers-schema.interface';
import {
  MessageTypeProvidersSchemaDefinerMock,
  ProviderMock,
  ProviderTypeAdapterMock,
} from './providers-manager.mocks';
import { ProvidersManager } from './providers-manager';
import { MediatorProvidersManager } from './providers-manager.impl';
import { MessageTypeProvidersSchemaDefiner } from './messages/shared/message-type-providers-schema-definer.port';

describe('ProvidersManager', () => {
  let manager: ProvidersManager;
  let adapters: ProviderTypeAdapter<object>[];
  let schemaDefiners: MessageTypeProvidersSchemaDefiner[];

  beforeEach(() => {
    schemaDefiners = [new MessageTypeProvidersSchemaDefinerMock()];
    adapters = [new ProviderTypeAdapterMock()];
    manager = new MediatorProvidersManager(schemaDefiners, adapters);
  });

  describe('getting message type providers', () => {
    it('should get message types providers', () => {
      expect(manager.list()).toEqual({ [schemaDefiners[0].messageType]: {} });
    });

    it('should get single message type providers', () => {
      expect(manager.get<MessageTypeProvidersSchema>(schemaDefiners[0].messageType)).toEqual({});
    });
  });

  describe('providers registration', () => {
    it('should register provider', () => {
      expect(manager.register(ProviderMock)).toEqual([ProviderMock]);
    });

    it('should register provider via adapter', () => {
      manager.register(ProviderMock);
      expect(adapters[0].register).toHaveBeenCalledTimes(1);
    });

    it('should skip provider registration - duplicate', () => {
      expect(manager.register(ProviderMock, ProviderMock)).toEqual([ProviderMock]);
    });
  });

  it('should skip provider registration - no matching metadata key', () => {
    expect(manager.register(class {})).toHaveLength(0);
  });
});
