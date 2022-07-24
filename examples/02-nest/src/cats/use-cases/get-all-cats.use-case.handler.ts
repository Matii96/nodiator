import { IRequestHandler, RequestHandler } from '@nodiator/core';
import { GetAllCatsUseCase } from './get-all-cats.use-case';
import { GetAllCatsUseCaseResult } from './get-all-cats.use-case.result';

@RequestHandler(GetAllCatsUseCase)
export class GetAllCatsUseCaseHandler implements IRequestHandler<GetAllCatsUseCase, GetAllCatsUseCaseResult> {
  async handle(request: GetAllCatsUseCase) {
    const result: GetAllCatsUseCaseResult = [
      { name: 'Luna', age: 2 },
      { name: 'Charlie', age: 3 },
    ];
    return result;
  }
}
