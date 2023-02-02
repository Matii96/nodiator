import { Observable } from 'rxjs';
import { IRequestHandler } from './request-handler';
import { IRequestPipeline } from './request-pipeline';

export class TestRequest {
  constructor(readonly property = '') {}
}

export class TestRequestPipeline implements IRequestPipeline<TestRequest> {
  handle = jest.fn((request: TestRequest, next: Observable<any>) => next);
}

export class TestRequestHandler implements IRequestHandler<TestRequest> {
  handle = jest.fn(async (): Promise<any> => undefined);
}
