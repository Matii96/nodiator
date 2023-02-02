import { delay, mergeMap, Observable, of } from 'rxjs';
import {
  GlobalRequestPipeline,
  IGlobalRequestPipeline,
  IRequestHandler,
  IRequestPipeline,
  Request,
  RequestHandler,
  RequestPipeline,
  ResponseType,
} from '../../lib';

export class TestRequest {
  readonly [ResponseType]?: string;
  constructor(readonly property: string) {}
}

@GlobalRequestPipeline()
export class TestGlobalRequestPipeline implements IGlobalRequestPipeline {
  static handle = jest.fn((request: Request, next: Observable<unknown>) => next);
  handle = TestGlobalRequestPipeline.handle;
}

@RequestPipeline(TestRequest)
export class TestRequestPipeline implements IRequestPipeline<TestRequest> {
  static handle = jest.fn((request: TestRequest, next: Observable<string>) => next);
  handle = TestRequestPipeline.handle;
}

@RequestPipeline(TestRequest)
export class TestLaggingRequestPipeline implements IRequestPipeline<TestRequest> {
  static handle = jest.fn((request: TestRequest, next: Observable<string>) =>
    of(1).pipe(
      delay(500),
      mergeMap(() => next)
    )
  );
  handle = TestLaggingRequestPipeline.handle;
}

@RequestHandler(TestRequest)
export class TestRequestHandler implements IRequestHandler<TestRequest> {
  static handle = jest.fn(async (request: TestRequest) => request.property);
  handle = TestRequestHandler.handle;
}
