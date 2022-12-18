import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';
import { MediatorFeatureExplorer } from '../explorer/mediator.feature.explorer';
import { MediatorFeatureExplorerMock } from '../explorer/mediator.feature.explorer.mocks';
import { MediatorFeatureConfigurator } from './mediator.feature.configurator';
import { TestRequest, TestRequestHandler } from './mediator.feature.configurator.mocks';

describe('MediatorFeatureConfigurator', () => {
  let configurator: MediatorFeatureConfigurator;
  let explorer: MediatorFeatureExplorer;
  let moduleRef: ModuleRef;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediatorFeatureConfigurator,
        { provide: ModuleRef, useValue: { get: jest.fn(), resolve: jest.fn() } },
        { provide: MediatorFeatureExplorer, useClass: MediatorFeatureExplorerMock },
      ],
    }).compile();

    configurator = module.get(MediatorFeatureConfigurator);
    explorer = module.get(MediatorFeatureExplorer);
    moduleRef = module.get(ModuleRef);
  });

  it('should configure feature', async () => {
    jest.spyOn(moduleRef, 'resolve').mockResolvedValueOnce(new TestRequestHandler());
    jest.spyOn(moduleRef, 'get').mockReturnValueOnce({}).mockReturnValueOnce({});
    jest.spyOn(explorer, 'exploreProviders').mockReturnValueOnce([TestRequestHandler]);
    const mediator = configurator.configureFeature(class {});
    await lastValueFrom(mediator.request(new TestRequest()));
    expect(mediator).toBeDefined();
  });

  it('should init extensions', () => {
    jest
      .spyOn(moduleRef, 'get')
      .mockReturnValueOnce({ use: jest.fn() })
      .mockReturnValueOnce({ extensions: [] })
      .mockReturnValueOnce({ extensions: [] });
    configurator.initExtensions();
    expect(moduleRef.get).toHaveBeenCalled();
  });
});
