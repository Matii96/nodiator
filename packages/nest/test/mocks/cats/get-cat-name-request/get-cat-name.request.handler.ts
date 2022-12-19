import { IRequestHandler, RequestHandler } from '@nodiator/core';
import { GetCatNameRequest } from './get-cat-name.request';

@RequestHandler(GetCatNameRequest)
export class GetCatNameRequestHandler implements IRequestHandler<GetCatNameRequest, string> {
  handle = jest.fn(async (request: GetCatNameRequest) => request.name);
}
