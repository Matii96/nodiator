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
  handle = jest.fn((request: TestRequest, next: () => Promise<void>) => next());
}

@RequestPipeline(TestRequest)
export class TestRequestPipeline implements IRequestPipeline<TestRequest, string> {
  handle = jest.fn((request: TestRequest, next: () => Promise<string>) => next());
}

@RequestPipeline(TestRequest)
export class TestLaggingPipeline implements IRequestPipeline<TestRequest, string> {
  handle = jest.fn((request: TestRequest, next: () => Promise<string>) =>
    new Promise((resolve) => setTimeout(resolve, 5)).then(() => next())
  );
}

@RequestHandler(TestRequest)
export class TestRequestHandler implements IRequestHandler<TestRequest, string> {
  handle = jest.fn(async (request: TestRequest) => request.property);
}
