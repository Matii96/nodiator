import { Controller, Get } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { InjectMediator } from '../../../lib/decorators/inject-mediator.decorator';
import { GetAllCatsUseCase } from './use-cases/get-all-cats.use-case';
import { GetAllCatsUseCaseResult } from './use-cases/get-all-cats.use-case.result';

@Controller('cats')
export class CatsController {
  constructor(@InjectMediator('cats') private readonly mediator: Mediator) {}

  @Get()
  getAllCats() {
    return this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase());
  }
}
