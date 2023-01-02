import { ExtensionsManager } from './extensions-manager';

export class ExtensionsManagerMock implements ExtensionsManager {
  list = jest.fn();
  load = jest.fn();
}
