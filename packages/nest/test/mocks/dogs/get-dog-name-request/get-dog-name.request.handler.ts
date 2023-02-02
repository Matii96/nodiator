import { IRequestHandler, RequestHandler } from '@nodiator/core';
import { GetDogNameRequest } from './get-dog-name.request';

@RequestHandler({ request: GetDogNameRequest, scoped: true })
export class GetDogNameRequestHandler implements IRequestHandler<GetDogNameRequest> {
  static instancesCounter = 0;

  constructor() {
    GetDogNameRequestHandler.instancesCounter++;
  }

  handle = jest.fn(async (request: GetDogNameRequest) => request.name);
}
