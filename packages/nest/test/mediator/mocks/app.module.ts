import { Module } from '@nestjs/common';
import { MediatorModule } from '../../../lib';
import { Namespaces } from '../../mocks/namespaces.enum';
import { CatsSubModule, DogsSubModule, AnimalsSubModule } from '../../mocks/submodules';

@Module({
  imports: [
    MediatorModule.forRoot({}, { namespace: Namespaces.CATS }, { namespace: Namespaces.DOGS }),
    CatsSubModule,
    DogsSubModule,
    AnimalsSubModule,
  ],
})
export class AppModule {}
