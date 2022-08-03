import {
  GlobalRequestPipeline,
  IRequest,
  IRequestHandler,
  IRequestPipeline,
  RequestHandler,
  RequestPipeline,
} from '../../lib';

export class TestRequest {
  constructor(readonly property: string) {}
}

@GlobalRequestPipeline()
export class TestGlobalRequestPipeline implements IRequestPipeline<IRequest, void> {
  static handle = jest.fn((request: IRequest, next: () => Promise<void>) => next());
  handle = TestGlobalRequestPipeline.handle;
}

@RequestPipeline(TestRequest)
export class TestRequestPipeline implements IRequestPipeline<TestRequest, string> {
  static handle = jest.fn((request: TestRequest, next: () => Promise<string>) => next());
  handle = TestRequestPipeline.handle;
}

@RequestPipeline(TestRequest)
export class TestLaggingRequestPipeline implements IRequestPipeline<TestRequest, string> {
  static handle = jest.fn((request: TestRequest, next: () => Promise<string>) =>
    new Promise((resolve) => setTimeout(resolve, 500)).then(() => next())
  );
  handle = TestLaggingRequestPipeline.handle;
}

@RequestHandler(TestRequest)
export class TestRequestHandler implements IRequestHandler<TestRequest, string> {
  static handle = jest.fn(async (request: TestRequest) => request.property);
  handle = TestRequestHandler.handle;
}
