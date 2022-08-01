import { Controller, Get } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { InjectMediator } from '@nodiator/nest';
import { Namespaces } from 'src/namespaces.enum';
import { GetAllCatsUseCase } from './use-cases/get-all-cats.use-case';
import { GetAllCatsUseCaseResult } from './use-cases/get-all-cats.use-case.result';

@Controller('cats')
export class CatsController {
  constructor(@InjectMediator(Namespaces.CATS) private readonly mediator: Mediator) {}

  @Get()
  getAllCats() {
    return this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase());
  }
}
