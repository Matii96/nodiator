import { IRequestHandler, RequestHandler } from '@nodiator/core';

export class TestRequest {
  constructor() {}
}

@RequestHandler(TestRequest)
export class TestRequestHandler implements IRequestHandler<TestRequest> {
  handle = jest.fn(async (): Promise<any> => undefined);
}
