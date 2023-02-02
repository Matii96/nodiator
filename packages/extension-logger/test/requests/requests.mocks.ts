import { IRequestHandler, IRequestPipeline, RequestHandler, RequestPipeline, ResponseType } from '@nodiator/core';
import { from, mergeMap, Observable, throwError } from 'rxjs';

export class TestRequest {
  readonly [ResponseType]?: string;
  constructor(readonly property: string) {}
}

@RequestPipeline(TestRequest)
export class TestRequestPipeline implements IRequestPipeline<TestRequest> {
  handle = jest.fn((request: TestRequest, next: Observable<string>) => next);
}

@RequestHandler(TestRequest)
export class TestRequestHandler implements IRequestHandler<TestRequest> {
  handle = jest.fn(async (request: TestRequest) => request.property);
}

@RequestPipeline(TestRequest)
export class FailingTestRequestPipeline implements IRequestPipeline<TestRequest> {
  handle = jest.fn((request: TestRequest, next: Observable<string>) =>
    next.pipe(mergeMap(() => from(throwError(() => new Error()))))
  );
}
