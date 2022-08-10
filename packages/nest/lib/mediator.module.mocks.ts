import { IRequestHandler, RequestHandler } from '@nodiator/core';

export class TestRequest {}

@RequestHandler({ request: TestRequest, scoped: true })
export class TestRequestHandler implements IRequestHandler<TestRequest, void> {
  async handle() {}
}
