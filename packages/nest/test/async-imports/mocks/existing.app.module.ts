import { Injectable, Module } from '@nestjs/common';
import { MediatorLoggingLevels } from '@nodiator/core';
import { MediatorOptionsFactory, MediatorModule } from '../../../lib';
import { CatsSubModule, DogsSubModule, AnimalsSubModule } from '../../mocks/submodules';
import { Namespaces } from '../../mocks/namespaces.enum';

@Injectable()
class Configurator implements MediatorOptionsFactory {
  createMediatorOptions() {
    return { config: () => ({ logs: { level: MediatorLoggingLevels.DEBUG } }) };
  }
}

@Module({
  imports: [
    MediatorModule.forRootAsync({
      imports: [ExistingAppModule],
      configurations: [
        { useExisting: Configurator },
        { namespace: Namespaces.CATS, useExisting: Configurator },
        { namespace: Namespaces.DOGS, useExisting: Configurator },
      ],
    }),
    CatsSubModule,
    DogsSubModule,
    AnimalsSubModule,
  ],
  providers: [Configurator],
  exports: [Configurator],
})
export class ExistingAppModule {}
