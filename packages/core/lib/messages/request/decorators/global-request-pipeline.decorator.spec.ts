import 'reflect-metadata';
import { SCOPE_OPTIONS_METADATA } from '../../constants';
import { ScopeOptions } from '../../interfaces';
import { TestEventHandler } from '../../messages.mocks';
import { GLOBAL_REQUEST_PIPELINE_METADATA } from '../constants';
import { GlobalRequestPipeline } from './global-request-pipeline.decorator';

describe('GlobalRequestPipeline', () => {
  it('should register metadata', () => {
    GlobalRequestPipeline({ scoped: true })(TestEventHandler);
    expect(Reflect.getMetadata(GLOBAL_REQUEST_PIPELINE_METADATA, TestEventHandler)).toEqual(true);
    expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestEventHandler)).toEqual({ scoped: true } as ScopeOptions);
  });
});
