import { isPromise } from './is-promise';

describe('isPromise', () => {
  it('should recognize promise', () => {
    expect(isPromise(new Promise<void>((resolve) => resolve()))).toBe(true);
  });

  it('should not recognize promise', () => {
    expect(isPromise('test')).toBe(false);
  });
});
