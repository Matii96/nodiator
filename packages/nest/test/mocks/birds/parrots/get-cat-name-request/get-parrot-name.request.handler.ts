import { IRequestHandler, RequestHandler } from '@nodiator/core';
import { GetParrotNameRequest } from './get-parrot-name.request';

@RequestHandler(GetParrotNameRequest)
export class GetParrotNameRequestHandler implements IRequestHandler<GetParrotNameRequest, string> {
  handle = jest.fn(async (request: GetParrotNameRequest) => request.name);
}
