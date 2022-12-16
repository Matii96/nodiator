import { RequestHandler, RequestHandler } from '@nodiator/core';

export class TestRequest {
  constructor(readonly property: string) {}
}

@RequestHandler({ request: TestRequest, scoped: true })
export class TestRequestHandler implements RequestHandler<TestRequest, string> {
  static instancesCounter = 0;

  constructor() {
    TestRequestHandler.instancesCounter++;
  }

  handle = jest.fn(async (request: TestRequest) => request.property);
}
