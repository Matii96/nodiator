import { Module } from '@nestjs/common';
import { MediatorModule } from '../../lib';
import { Namespaces } from './namespaces.enum';
import { SubModuleA, SubModuleB, SubModuleC } from './submodules';

@Module({
  imports: [
    MediatorModule.forRoot({ namespace: Namespaces.NAMESPACE1 }, { namespace: Namespaces.NAMESPACE2 }),
    SubModuleA,
    SubModuleB,
    SubModuleC,
  ],
})
export class AppModule {}
