import { IRequestHandler, RequestHandler } from '@nodiator/core';
import { allCatsResult } from '../db';
import { GetAllCatsUseCase } from './get-all-cats.use-case';
import { GetAllCatsUseCaseResult } from './get-all-cats.use-case.result';

@RequestHandler(GetAllCatsUseCase)
export class GetAllCatsUseCaseHandler implements IRequestHandler<GetAllCatsUseCase, GetAllCatsUseCaseResult> {
  async handle(request: GetAllCatsUseCase) {
    return allCatsResult;
  }
}
