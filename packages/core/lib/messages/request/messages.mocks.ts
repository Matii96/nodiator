import { Observable } from 'rxjs';
import { IRequestHandler, IRequestPipeline } from './interfaces';

export class TestRequest {
  constructor(readonly property = '') {}
}

export class TestRequestPipeline implements IRequestPipeline<TestRequest, any> {
  handle = jest.fn((request: TestRequest, next: Observable<any>) => next);
}

export class TestRequestHandler implements IRequestHandler<TestRequest, any> {
  handle = jest.fn(async (): Promise<any> => undefined);
}
