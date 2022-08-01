import { Module } from '@nestjs/common';
import { MediatorModule } from '@nodiator/nest';
import { Namespaces } from '../namespaces.enum';
import { CatsController } from './cats.controller';
import { GetAllCatsUseCaseHandler } from './use-cases/get-all-cats.use-case.handler';

@Module({
  imports: [MediatorModule.forFeature({ module: CatsModule, namespace: Namespaces.CATS })],
  controllers: [CatsController],
  providers: [GetAllCatsUseCaseHandler],
})
export class CatsModule {}
