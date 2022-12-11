import { from, mergeMap, Observable, throwError } from 'rxjs';
import { IRequestHandler, IRequestPipeline, RequestHandler, RequestPipeline } from '@nodiator/core';

export class TestRequest {
  constructor(readonly property: string) {}
}

@RequestPipeline(TestRequest)
export class TestRequestPipeline implements IRequestPipeline<TestRequest, string> {
  handle = jest.fn((request: TestRequest, next: Observable<string>) => next);
}

@RequestHandler(TestRequest)
export class TestRequestHandler implements IRequestHandler<TestRequest, string> {
  handle = jest.fn(async (request: TestRequest) => request.property);
}

@RequestPipeline(TestRequest)
export class FailingTestRequestPipeline implements IRequestPipeline<TestRequest, string> {
  handle = jest.fn((request: TestRequest, next: Observable<string>) =>
    next.pipe(mergeMap(() => from(throwError(() => new Error()))))
  );
}
