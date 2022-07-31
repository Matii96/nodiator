import { Module } from '@nestjs/common';
import { GetAllCatsUseCaseHandler } from './use-cases/get-all-cats.use-case.handler';

@Module({
  providers: [GetAllCatsUseCaseHandler],
})
export class CatsModule {}
