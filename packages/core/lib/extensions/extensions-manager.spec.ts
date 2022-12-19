import 'reflect-metadata';
import { MediatorMock } from '../mediator/mediator.mocks';
import { MediatorExtension } from './extension.interface';
import { ExtensionsManager } from './ports/extensions-manager.port';
import { MediatorExtensionsManager } from './extensions-manager';

describe('ExtensionsManager', () => {
  let manager: ExtensionsManager;

  beforeEach(() => {
    manager = new MediatorExtensionsManager();
  });

  it('should list extensions', () => {
    expect(manager.list()).toHaveLength(0);
  });

  it('should load extension', () => {
    const extension: MediatorExtension = { init: jest.fn() };
    manager.load(extension, new MediatorMock());
    expect(extension.init).toHaveBeenCalledTimes(1);
  });
});
