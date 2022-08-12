import { DuplicatedNamespacesException } from '../exceptions/duplicated-namespaces.exception';
import { MediatorModuleOptionsValidator } from './mediator.module.options.validator';

describe('MediatorModuleOptionsValidator', () => {
  it('should pass validation - default configuration', () => {
    expect(MediatorModuleOptionsValidator.validate([{}])).toBeUndefined();
  });

  it('should pass validation - multiple namespaces', () => {
    expect(MediatorModuleOptionsValidator.validate([{ namespace: 'A' }, { namespace: 'B' }])).toBeUndefined();
  });

  it('should fail validation - duplicated namespace', () => {
    const namespace = 'A';
    expect(() => MediatorModuleOptionsValidator.validate([{ namespace }, { namespace }])).toThrow(
      DuplicatedNamespacesException
    );
  });

  it('should fail validation - duplicated default namespace', () => {
    expect(() => MediatorModuleOptionsValidator.validate([{}, {}])).toThrow(DuplicatedNamespacesException);
  });
});
