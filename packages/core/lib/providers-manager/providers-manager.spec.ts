import 'reflect-metadata';
import { MediatorLoggerMock } from '../logging/logging.mocks';
import { IMediatorLogger } from '../config/mediator.options';
import { IMessageTypeProvidersSchemaDefiner } from './ports/message-type-providers-schema-definer.port';
import { IProviderTypeAdapter } from './ports/provider-type-adapter.port';
import { IMessageTypeProvidersSchema } from './interfaces/message-type-providers-schema.interface';
import {
  MessageTypeProvidersSchemaDefinerMock,
  ProviderMock,
  ProviderTypeAdapterMock,
} from './providers-manager.mocks';
import { IProvidersManager } from './ports/providers-manager.port';
import { ProvidersManager } from './providers-manager';

describe('ProvidersManager', () => {
  let logger: IMediatorLogger;
  let manager: IProvidersManager;
  let adapters: IProviderTypeAdapter<object>[];
  let schemaDefiners: IMessageTypeProvidersSchemaDefiner[];

  beforeEach(() => {
    logger = new MediatorLoggerMock();
    schemaDefiners = [new MessageTypeProvidersSchemaDefinerMock()];
    adapters = [new ProviderTypeAdapterMock()];
    manager = new ProvidersManager(logger, schemaDefiners, adapters);
  });

  describe('getting message type providers', () => {
    it('should get message types providers', () => {
      expect(manager.get()).toEqual({ [schemaDefiners[0].messageType]: {} });
    });

    it('should get single message type providers', () => {
      expect(manager.get<IMessageTypeProvidersSchema>(schemaDefiners[0].messageType)).toEqual({});
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

    it('should skip provider registration - no matching metadata key', () => {
      expect(manager.register(class {})).toHaveLength(0);
    });

    it('should supress logging', () => {
      manager.register({ providers: [ProviderMock], silent: true });
      expect(logger.debug).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.warn).not.toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
    });
  });
});
