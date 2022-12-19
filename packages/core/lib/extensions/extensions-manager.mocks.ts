import { ExtensionsManager } from './ports/extensions-manager.port';

export class ExtensionsManagerMock implements ExtensionsManager {
  list = jest.fn();
  load = jest.fn();
}
