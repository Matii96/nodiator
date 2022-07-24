import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { GetAllCatsUseCaseHandler } from './use-cases/get-all-cats.use-case.handler';

@Module({
  controllers: [CatsController],
  providers: [GetAllCatsUseCaseHandler],
})
export class CatsModule {}
