import { Injectable, Module } from '@nestjs/common';
import { MediatorLoggingLevels } from '@nodiator/core';
import { MediatorModule } from '../../../lib';
import { Namespaces } from '../../mocks/namespaces.enum';
import { CatsSubModule, DogsSubModule, AnimalsSubModule } from '../../mocks/submodules';

@Injectable()
class Configurator {
  debug() {
    return MediatorLoggingLevels.DEBUG;
  }

  suppressLogs() {
    return MediatorLoggingLevels.NONE;
  }
}

@Module({
  imports: [
    MediatorModule.forRootAsync({
      imports: [FactoryAppModule],
      configurations: [
        {
          inject: [Configurator],
          useFactory: (config: Configurator) => ({ config: () => ({ logs: { level: config.debug() } }) }),
        },
        {
          namespace: Namespaces.CATS,
          inject: [Configurator],
          useFactory: (config: Configurator) => ({ config: () => ({ logs: { level: config.debug() } }) }),
        },
        {
          namespace: Namespaces.DOGS,
          inject: [Configurator],
          useFactory: (config: Configurator) => ({
            config: () => ({ logs: { level: config.suppressLogs() } }),
          }),
        },
      ],
    }),
    CatsSubModule,
    DogsSubModule,
    AnimalsSubModule,
  ],
  providers: [Configurator],
  exports: [Configurator],
})
export class FactoryAppModule {}
