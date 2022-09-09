import { Injectable, Module } from '@nestjs/common';
import { MediatorLoggingLevels } from '@nodiator/core';
import { IMediatorOptionsFactory, MediatorModule } from '../../../lib';
import { CatsSubModule, DogsSubModule, AnimalsSubModule } from '../../mocks/submodules';
import { Namespaces } from '../../mocks/namespaces.enum';

@Injectable()
class Configurator implements IMediatorOptionsFactory {
  createMediatorOptions() {
    return { config: () => ({ logs: { level: MediatorLoggingLevels.DEBUG } }) };
  }
}

@Module({
  imports: [
    MediatorModule.forRootAsync({
      configurations: [
        { useClass: Configurator },
        { namespace: Namespaces.CATS, useClass: Configurator },
        { namespace: Namespaces.DOGS, useClass: Configurator },
      ],
    }),
    CatsSubModule,
    DogsSubModule,
    AnimalsSubModule,
  ],
})
export class ClassAppModule {}
