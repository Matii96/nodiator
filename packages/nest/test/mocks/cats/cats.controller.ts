import { Controller, Get } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { GetAllCatsUseCase } from './use-cases/get-all-cats.use-case';
import { GetAllCatsUseCaseResult } from './use-cases/get-all-cats.use-case.result';

@Controller('cats')
export class CatsController {
  constructor(private readonly mediator: Mediator) {}

  @Get()
  getAllCats() {
    return this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase());
  }
}
