import 'reflect-metadata';
import { SCOPE_OPTIONS_METADATA } from '../../constants';
import { ScopeOptions } from '../../interfaces';
import { REQUEST_PIPELINE_METADATA } from '../constants';
import { TestRequest, TestRequestPipeline } from '../requests.mocks';
import { RequestPipeline } from './request-pipeline.decorator';

class SomeRequest {}

describe('RequestPipeline', () => {
  // beforeEach(() => {
  //   Reflect.defineMetadata(MESSAGE_METADATA, undefined, TestRequest);
  // });

  describe('requests registration', () => {
    it('should register pipeline for request', () => {
      RequestPipeline(TestRequest)(TestRequestPipeline);

      expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestRequestPipeline)).toBeUndefined();
      expect(Reflect.getMetadata(REQUEST_PIPELINE_METADATA, TestRequestPipeline)).toEqual(new Set([TestRequest]));
    });

    it('should register pipeline for multiple requests', () => {
      RequestPipeline(TestRequest, SomeRequest)(TestRequestPipeline);

      expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestRequestPipeline)).toBeUndefined();
      expect(Reflect.getMetadata(REQUEST_PIPELINE_METADATA, TestRequestPipeline)).toEqual(
        new Set([TestRequest, SomeRequest])
      );
    });
  });

  describe('scoping', () => {
    it('should register provider as scoped', () => {
      RequestPipeline({ request: TestRequest, scoped: true })(TestRequestPipeline);
      expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestRequestPipeline)).toEqual({
        scoped: true,
      } as ScopeOptions);
    });
  });
});
