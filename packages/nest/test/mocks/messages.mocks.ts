import { IRequestHandler, RequestHandler } from '@nodiator/core';

export class TestRequest {
  constructor(readonly property: string) {}
}

@RequestHandler({ request: TestRequest, scoped: true })
export class TestRequestHandler implements IRequestHandler<TestRequest, string> {
  static instancesCounter = 0;

  constructor() {
    TestRequestHandler.instancesCounter++;
  }

  handle = jest.fn(async (request: TestRequest) => request.property);
}
