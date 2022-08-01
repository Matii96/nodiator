import { Module } from '@nestjs/common';
import { MediatorModule } from '../../../lib';
import { CatsController } from './cats.controller';
import { GetAllCatsUseCaseHandler } from './use-cases/get-all-cats.use-case.handler';

@Module({
  imports: [MediatorModule.forFeature({ module: CatsModule, namespace: 'cats' })],
  providers: [GetAllCatsUseCaseHandler],
  controllers: [CatsController],
})
export class CatsModule {}
