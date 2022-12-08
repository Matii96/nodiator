import 'reflect-metadata';
import { MediatorMock } from '../mediator/mediator.mocks';
import { IMediatorExtension } from './extension.interface';
import { ExtensionsManager } from './extensions-manager';
import { IExtensionsManager } from './ports/extensions-manager.port';

describe('ExtensionsManager', () => {
  let manager: IExtensionsManager;

  beforeEach(() => {
    manager = new ExtensionsManager();
  });

  it('should list extensions', () => {
    expect(manager.list()).toHaveLength(0);
  });

  it('should load extension', () => {
    const extension: IMediatorExtension = { init: jest.fn() };
    manager.load(extension, new MediatorMock());
    expect(extension.init).toHaveBeenCalledTimes(1);
  });
});
