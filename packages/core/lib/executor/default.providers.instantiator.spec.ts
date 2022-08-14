import 'reflect-metadata';
import { ScopeOptions, SCOPE_OPTIONS_METADATA } from '../messages';
import { TestRequestHandler } from '../messages/messages.mocks';
import { DefaultProvidersInstantiator } from './default.providers.instantiator';

describe('DefaultProvidersInstantiator', () => {
  let instantiator: DefaultProvidersInstantiator;

  beforeEach(() => {
    instantiator = new DefaultProvidersInstantiator();
  });

  describe('singleton', () => {
    beforeEach(() => {
      Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, { scoped: false } as ScopeOptions, TestRequestHandler);
    });

    it('should create provider instance', () => {
      expect(instantiator.instantiate(TestRequestHandler)).toBeInstanceOf(TestRequestHandler);
    });

    it('should create singleton instance and cache it', () => {
      const instance = instantiator.instantiate(TestRequestHandler);
      expect(instantiator.instantiate(TestRequestHandler)).toBe(instance);
    });
  });

  describe('scoped', () => {
    beforeEach(() => {
      Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, { scoped: true } as ScopeOptions, TestRequestHandler);
    });

    it('should create provider instance', () => {
      expect(instantiator.instantiate(TestRequestHandler)).toBeInstanceOf(TestRequestHandler);
    });

    it('should create scoped instances', () => {
      const instance = instantiator.instantiate(TestRequestHandler);
      expect(instantiator.instantiate(TestRequestHandler)).not.toBe(instance);
    });
  });
});
