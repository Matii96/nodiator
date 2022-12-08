import { IExtensionsManager } from './ports/extensions-manager.port';

export class ExtensionsManagerMock implements IExtensionsManager {
  list = jest.fn();
  load = jest.fn();
}
