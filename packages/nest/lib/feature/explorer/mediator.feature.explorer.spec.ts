import { Test, TestingModule } from '@nestjs/testing';
import { MediatorFeatureExplorer } from './mediator.feature.explorer';
import { ModuleMock, NestedProviderMock, ProviderMock } from './mediator.feature.explorer.mocks';

describe('MediatorFeatureExplorer', () => {
  let explorer: MediatorFeatureExplorer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ModuleMock],
      providers: [MediatorFeatureExplorer],
    }).compile();

    explorer = module.get(MediatorFeatureExplorer);
  });

  it('should resolve declared provider', () => {
    expect(explorer.exploreProviders(ModuleMock).includes(ProviderMock)).toBe(true);
  });

  it('should resolve nested provider', () => {
    expect(explorer.exploreProviders(ModuleMock).includes(NestedProviderMock)).toBe(true);
  });
});
